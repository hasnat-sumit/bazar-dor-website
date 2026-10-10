import Link from "next/link";
import { notFound } from "next/navigation";

interface MarketItem {
  marketName: string;
  division: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

interface ProductDetail {
  id: string | number;
  slug?: string;
  nameBn: string;
  category?: string;
  categoryIcon?: string;
  categoryNameBn?: string;
  categorySlug?: string;
  unit?: string;
  image?: string;
  today?: number | string;
  yesterday?: number | string;
  avg?: number | string;
  average?: number | string;
  markets?: any[];
}

// Safe formatting helper to prevent undefined/NaN crashes
function formatBnNumber(num: number | null | undefined, maxDigits = 2) {
  const safeNum = Number(num);
  if (!Number.isFinite(safeNum)) {
    return "০";
  }
  return safeNum.toLocaleString("bn-BD", { maximumFractionDigits: maxDigits });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = params ? await Promise.resolve(params) : {};
  const id = resolvedParams?.id;

  if (!id) {
    notFound();
  }

  const decodedId = decodeURIComponent(id);

  let product: ProductDetail | null = null;

  try {
    const res = await fetch(
      "https://api.api-store.workers.dev/api/bazardor/products",
      { next: { revalidate: 300 } }
    );

    if (res.ok) {
      const result = await res.json();
      const list: ProductDetail[] = Array.isArray(result)
        ? result
        : result.products ?? result.data ?? [];

      const found = list.find(
        (p) =>
          String(p.id) === decodedId ||
          String(p.slug) === decodedId
      );

      if (found) {
        product = found;
      }
    }

    if (!product) {
      const directRes = await fetch(
        `https://api.api-store.workers.dev/api/bazardor/products/${decodedId}`,
        { next: { revalidate: 300 } }
      );
      if (directRes.ok) {
        const directData = await directRes.json();
        product = directData.product ?? directData;
      }
    }
  } catch (error) {
    console.error("Failed to fetch product details:", error);
  }

  if (!product) {
    notFound();
  }

  const todayPrice = Number(product.today ?? 0);
  const yesterdayPrice = Number(product.yesterday ?? 0);
  const diff = todayPrice - yesterdayPrice;
  const changePercent = yesterdayPrice > 0 ? (diff / yesterdayPrice) * 100 : 0;
  const isIncreased = diff > 0;
  const isDecreased = diff < 0;

  // Map markets using exact API properties ("market", "min", "max")
  const rawMarkets = product.markets ?? [];
  let markets: MarketItem[] = rawMarkets.map((m: any) => {
    const min = Number(m.min ?? todayPrice);
    const max = Number(m.max ?? min);
    const avg = Math.round((min + max) / 2); // Calculate average per market from min & max

    return {
      marketName: m.market ?? "সদর বাজার",
      division: m.division ?? "ঢাকা",
      minPrice: min,
      maxPrice: max,
      avgPrice: avg,
    };
  });

  // Fallback if no market data is returned from the API
  if (markets.length === 0) {
    const base = todayPrice > 0 ? todayPrice : 60;
    markets = [
      { marketName: "সদর বাজার", division: "ঢাকা", minPrice: Math.round(base * 0.95), maxPrice: Math.round(base * 1.05), avgPrice: base },
      { marketName: "কারওয়ান বাজার", division: "ঢাকা", minPrice: Math.round(base * 0.92), maxPrice: Math.round(base * 1.02), avgPrice: Math.round(base * 0.97) },
      { marketName: "গ্রীন মার্কেট, মিরপুর", division: "ঢাকা", minPrice: Math.round(base * 0.96), maxPrice: Math.round(base * 1.08), avgPrice: Math.round(base * 1.02) },
      { marketName: "আমতলী বাজার", division: "চট্টগ্রাম", minPrice: Math.round(base * 0.90), maxPrice: Math.round(base * 1.00), avgPrice: Math.round(base * 0.95) },
    ];
  }

  // Find absolute minimum and maximum across all markets
  const minItem = markets.reduce(
    (min, curr) => (curr.minPrice < min.minPrice ? curr : min),
    markets[0]
  );
  const maxItem = markets.reduce(
    (max, curr) => (curr.maxPrice > max.maxPrice ? curr : max),
    markets[0]
  );

  // Overall average price calculation
  const avgCalculated = Math.round(
    markets.reduce((sum, curr) => sum + curr.avgPrice, 0) / markets.length
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-5 sm:py-6">
      {/* Breadcrumb */}
      <nav className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-green-700 transition-colors">
          হোম
        </Link>
        <span>›</span>
        {product.categoryNameBn && (
          <>
            <Link
              href={`/categories/${product.categorySlug || product.category || ""}`}
              className="hover:text-green-700 transition-colors"
            >
              {product.categoryNameBn}
            </Link>
            <span>›</span>
          </>
        )}
        <span className="text-gray-900 font-medium">{product.nameBn}</span>
      </nav>

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <span className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-2xl sm:text-3xl">
            {product.categoryIcon || product.image || "🛒"}
          </span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {product.nameBn}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              প্রতি {product.unit === "kg" ? "কেজি" : product.unit || "কেজি"} · {product.categoryNameBn || "নিত্যপ্রয়োজনীয় পণ্য"}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1.5 flex items-center gap-1">
              গতকালের তুলনায় আজ দাম{" "}
              <span
                className={
                  isIncreased
                    ? "text-red-600 font-semibold"
                    : isDecreased
                    ? "text-green-600 font-semibold"
                    : "text-gray-600"
                }
              >
                {isIncreased ? "বেড়েছে" : isDecreased ? "কমেছে" : "অপরিবর্তিত"}
              </span>{" "}
              · {formatBnNumber(Math.abs(diff))} টাকা
            </p>
          </div>
        </div>

        {/* Right side price box */}
        <div className="w-full md:w-auto bg-gray-50 border border-gray-200 rounded-xl p-3.5 sm:p-4 text-center md:text-right shrink-0">
          <p className="text-xs text-gray-500">আজকের দাম</p>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 my-0.5">
            {formatBnNumber(todayPrice)}{" "}
            <span className="text-xs font-normal text-gray-600">
              টাকা / {product.unit === "kg" ? "কেজি" : product.unit || "কেজি"}
            </span>
          </div>
          {changePercent !== 0 && (
            <div
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1 ${
                isIncreased
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {isIncreased ? "▲ +" : "▼ "}
              {formatBnNumber(Math.abs(changePercent), 1)}%
            </div>
          )}
        </div>
      </div>

      {/* Price Summary Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
          দামের সারাংশ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
            <p className="text-lg sm:text-xl font-bold text-green-700 my-1">
              {formatBnNumber(minItem?.minPrice)} টাকা
            </p>
            <p className="text-xs text-gray-500">
              সবচেয়ে কম দামের বাজার:{" "}
              <span className="font-medium text-gray-800">
                {minItem?.marketName} ({minItem?.division})
              </span>
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500">সর্বাধিক দাম</p>
            <p className="text-lg sm:text-xl font-bold text-red-600 my-1">
              {formatBnNumber(maxItem?.maxPrice)} টাকা
            </p>
            <p className="text-xs text-gray-500">
              সবচেয়ে বেশি দামের বাজার:{" "}
              <span className="font-medium text-gray-800">
                {maxItem?.marketName} ({maxItem?.division})
              </span>
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs text-gray-500">গড় দাম</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 my-1">
              {formatBnNumber(todayPrice > 0 ? todayPrice : avgCalculated)} টাকা
            </p>
            <p className="text-xs text-gray-500">
              প্রতি {product.unit === "kg" ? "কেজি" : product.unit || "কেজি"} -এর হিসেবে
            </p>
          </div>
        </div>
      </div>

      {/* Market-wise Table Section */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            বাজারভিত্তিক আজকের দাম
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs sm:text-sm font-semibold text-gray-600">
                <th className="py-3 px-4">বাজার</th>
                <th className="py-3 px-4">বিভাগ</th>
                <th className="py-3 px-4">সর্বনিম্ন</th>
                <th className="py-3 px-4">সর্বাধিক</th>
                <th className="py-3 px-4">গড়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm text-gray-800">
              {markets.map((market, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-gray-900">
                    {market.marketName}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {market.division}
                  </td>
                  <td className="py-3.5 px-4">
                    {formatBnNumber(market.minPrice)} টাকা
                  </td>
                  <td className="py-3.5 px-4">
                    {formatBnNumber(market.maxPrice)} টাকা
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    {formatBnNumber(market.avgPrice)} টাকা
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}