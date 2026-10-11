
import Link from "next/link";

type Product = {
  id: string | number;
  slug?: string | null;
  nameBn: string;
  categoryIcon?: string | null;
  categoryNameBn?: string | null;
  today?: number | string | null;
  yesterday?: number | string | null;
  unit?: string | null;
};

function formatPrice(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

export default async function ProductsPage() {
  let products: (Product & {
    todayPrice: number;
    change: number | null;
  })[] = [];

  try {
    const res = await fetch(
      "https://api.api-store.workers.dev/api/bazardor/products",
      { next: { revalidate: 300 } }
    );

    if (res.ok) {
      const result = await res.json();

      const rawProducts: Product[] = Array.isArray(result)
        ? result
        : result.products ?? result.data ?? [];

      products = rawProducts
        .map((product) => {
          const today = Number(product.today);
          const yesterday = Number(product.yesterday);

          const validToday =
            product.today != null &&
            product.today !== "" &&
            Number.isFinite(today) &&
            today >= 0;

          const validYesterday =
            product.yesterday != null &&
            product.yesterday !== "" &&
            Number.isFinite(yesterday) &&
            yesterday > 0;

          if (!validToday) return null;

          return {
            ...product,
            todayPrice: today,
            change: validYesterday
              ? ((today - yesterday) / yesterday) * 100
              : null,
          };
        })
        .filter((product) => product !== null);
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          সব পণ্য
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর দেখুন।
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          কোনো পণ্যের তথ্য পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {products.map((product) => {
            const increased =
              product.change !== null && product.change > 0;
            const decreased =
              product.change !== null && product.change < 0;

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug || product.id}`}
                className="flex min-w-0 flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 transition-all duration-200 hover:border-green-300 hover:shadow-md sm:p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                    {product.categoryIcon || "🛒"}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {product.nameBn}
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {product.categoryNameBn ||
                        "নিত্যপ্রয়োজনীয় পণ্য"}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 flex items-end justify-between gap-2 border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-[11px] text-gray-500">
                      আজকের দাম
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                      {formatPrice(product.todayPrice)} টাকা
                      {product.unit ? ` / ${product.unit}` : ""}
                    </p>
                  </div>

                  {product.change === null ? (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                      তথ্য নেই
                    </span>
                  ) : (
                    <span
                      className={`flex shrink-0 items-center gap-0.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        increased
                          ? "bg-red-50 text-red-600"
                          : decreased
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {increased ? "▲ +" : decreased ? "▼ " : ""}
                      {Math.abs(product.change).toLocaleString(
                        "bn-BD",
                        {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        }
                      )}
                      %
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
