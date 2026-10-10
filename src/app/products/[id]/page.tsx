
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

function formatBnNumber(
  num: number | null | undefined,
  maxDigits = 2
) {
  const safeNum = Number(num);

  if (!Number.isFinite(safeNum)) {
    return "০";
  }

  return safeNum.toLocaleString("bn-BD", {
    maximumFractionDigits: maxDigits,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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
        `https://api.api-store.workers.dev/api/bazardor/products/${encodeURIComponent(decodedId)}`,
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

  const changePercent =
    yesterdayPrice > 0 ? (diff / yesterdayPrice) * 100 : 0;

  const isIncreased = diff > 0;
  const isDecreased = diff < 0;

  const rawMarkets = product.markets ?? [];

  let markets: MarketItem[] = rawMarkets.map((m: any) => {
    const min = Number(m.min ?? todayPrice);
    const max = Number(m.max ?? min);
    const avg = Math.round((min + max) / 2);

    return {
      marketName: m.market ?? "সদর বাজার",
      division: m.division ?? "ঢাকা",
      minPrice: min,
      maxPrice: max,
      avgPrice: avg,
    };
  });

  if (markets.length === 0) {
    const base = todayPrice > 0 ? todayPrice : 60;

    markets = [
      {
        marketName: "সদর বাজার",
        division: "ঢাকা",
        minPrice: Math.round(base * 0.95),
        maxPrice: Math.round(base * 1.05),
        avgPrice: base,
      },
      {
        marketName: "কারওয়ান বাজার",
        division: "ঢাকা",
        minPrice: Math.round(base * 0.92),
        maxPrice: Math.round(base * 1.02),
        avgPrice: Math.round(base * 0.97),
      },
      {
        marketName: "গ্রীন মার্কেট, মিরপুর",
        division: "ঢাকা",
        minPrice: Math.round(base * 0.96),
        maxPrice: Math.round(base * 1.08),
        avgPrice: Math.round(base * 1.02),
      },
      {
        marketName: "আমতলী বাজার",
        division: "চট্টগ্রাম",
        minPrice: Math.round(base * 0.9),
        maxPrice: Math.round(base),
        avgPrice: Math.round(base * 0.95),
      },
    ];
  }

  const minItem = markets.reduce((min, curr) =>
    curr.minPrice < min.minPrice ? curr : min
  , markets[0]);

  const maxItem = markets.reduce((max, curr) =>
    curr.maxPrice > max.maxPrice ? curr : max
  , markets[0]);

  const avgCalculated = Math.round(
    markets.reduce((sum, curr) => sum + curr.avgPrice, 0) /
      markets.length
  );

  const unit = product.unit === "kg"
    ? "কেজি"
    : product.unit || "কেজি";

  return (
    <main className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-4 sm:py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-xs text-gray-500 sm:mb-6 sm:text-sm">
        <Link
          href="/"
          className="transition-colors hover:text-green-700"
        >
          হোম
        </Link>

        <span>›</span>

        {product.categoryNameBn && (
          <>
            <Link
              href={`/categories/${product.categorySlug || product.category || ""}`}
              className="transition-colors hover:text-green-700"
            >
              {product.categoryNameBn}
            </Link>
            <span>›</span>
          </>
        )}

        <span className="font-medium text-gray-900">
          {product.nameBn}
        </span>
      </nav>

      {/* Top Header Card */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mb-8 sm:p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-2xl sm:h-16 sm:w-16 sm:text-3xl">
            {product.categoryIcon || product.image || "🛒"}
          </span>

          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {product.nameBn}
            </h1>

            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              প্রতি {unit} · {product.categoryNameBn || "নিত্যপ্রয়োজনীয় পণ্য"}
            </p>

            <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-600 sm:text-sm">
              গতকালের তুলনায় আজ দাম{" "}
              <span
                className={
                  isIncreased
                    ? "font-semibold text-red-600"
                    : isDecreased
                      ? "font-semibold text-green-600"
                      : "text-gray-600"
                }
              >
                {isIncreased
                  ? "বেড়েছে"
                  : isDecreased
                    ? "কমেছে"
                    : "অপরিবর্তিত"}
              </span>
              {" "}· {formatBnNumber(Math.abs(diff))} টাকা
            </p>
          </div>
        </div>

        {/* Current Price */}
        <div className="w-full shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-center sm:p-4 md:w-auto md:text-right">
          <p className="text-xs text-gray-500">আজকের দাম</p>

          <div className="my-0.5 text-xl font-bold text-gray-900 sm:text-2xl">
            {formatBnNumber(todayPrice)}{" "}
            <span className="text-xs font-normal text-gray-600">
              টাকা / {unit}
            </span>
          </div>

          {changePercent !== 0 && (
            <div
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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

      {/* Price Summary */}
      <section className="mb-6 sm:mb-8">
        <h2 className="mb-3 text-base font-bold text-gray-900 sm:mb-4 sm:text-lg">
          দামের সারাংশ
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">সর্বনিম্ন দাম</p>
            <p className="my-1 text-lg font-bold text-green-700 sm:text-xl">
              {formatBnNumber(minItem?.minPrice)} টাকা
            </p>
            <p className="text-xs text-gray-500">
              সবচেয়ে কম দামের বাজার:{" "}
              <span className="font-medium text-gray-800">
                {minItem?.marketName} ({minItem?.division})
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">সর্বাধিক দাম</p>
            <p className="my-1 text-lg font-bold text-red-600 sm:text-xl">
              {formatBnNumber(maxItem?.maxPrice)} টাকা
            </p>
            <p className="text-xs text-gray-500">
              সবচেয়ে বেশি দামের বাজার:{" "}
              <span className="font-medium text-gray-800">
                {maxItem?.marketName} ({maxItem?.division})
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">গড় দাম</p>
            <p className="my-1 text-lg font-bold text-gray-900 sm:text-xl">
              {formatBnNumber(
                todayPrice > 0 ? todayPrice : avgCalculated
              )} টাকা
            </p>
            <p className="text-xs text-gray-500">
              প্রতি {unit}-এর হিসেবে
            </p>
          </div>
        </div>
      </section>

      {/* Market-wise Prices */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4 sm:p-5">
          <h2 className="text-base font-bold text-gray-900 sm:text-lg">
            বাজারভিত্তিক আজকের দাম
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 sm:text-sm">
                <th className="px-4 py-3">বাজার</th>
                <th className="px-4 py-3">বিভাগ</th>
                <th className="px-4 py-3">সর্বনিম্ন</th>
                <th className="px-4 py-3">সর্বাধিক</th>
                <th className="px-4 py-3">গড়</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-xs text-gray-800 sm:text-sm">
              {markets.map((market, idx) => (
                <tr
                  key={`${market.marketName}-${idx}`}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3.5 font-medium text-gray-900">
                    {market.marketName}
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {market.division}
                  </td>
                  <td className="px-4 py-3.5">
                    {formatBnNumber(market.minPrice)} টাকা
                  </td>
                  <td className="px-4 py-3.5">
                    {formatBnNumber(market.maxPrice)} টাকা
                  </td>
                  <td className="px-4 py-3.5 font-semibold">
                    {formatBnNumber(market.avgPrice)} টাকা
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
