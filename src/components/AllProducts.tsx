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

type ProductWithChange = Product & {
  todayPrice: number;
  change: number;
};

function formatPrice(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

function ProductSection({
  title,
  products,
  type,
}: {
  title: string;
  products: ProductWithChange[];
  type: "increased" | "decreased" | "all";
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mb-8 sm:mb-10">
      <h2 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900">
        {type !== "all" && (
          <span
            className={
              type === "increased" ? "text-red-600" : "text-green-600"
            }
          >
            {type === "increased" ? "▲" : "▼"}
          </span>
        )}
        {title}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {products.map((product) => {
          const increased = product.change > 0;
          const decreased = product.change < 0;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug || product.id}`}
              className="flex min-w-0 flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 sm:p-4 transition-all duration-200 hover:border-green-300 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl sm:text-2xl">
                  {product.categoryIcon || "🛒"}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-gray-900">
                    {product.nameBn}
                  </h3>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">
                    {product.categoryNameBn || "নিত্যপ্রয়োজনীয় পণ্য"}
                  </p>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">
                    আজকের দাম
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm font-bold text-gray-900">
                    {formatPrice(product.todayPrice)} টাকা {product.unit ? `/ ${product.unit}` : ''}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold flex items-center gap-0.5 ${increased
                      ? "bg-red-50 text-red-600"
                      : decreased
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {increased ? "▲ +" : decreased ? "▼ " : ""}
                  {Math.abs(product.change).toLocaleString("bn-BD", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  %
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default async function AllProducts() {
  let products: ProductWithChange[] = [];

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
        .map((product): ProductWithChange | null => {
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

          if (!validToday || !validYesterday) {
            return null;
          }

          return {
            ...product,
            todayPrice: today,
            change: ((today - yesterday) / yesterday) * 100,
          };
        })
        .filter((product): product is ProductWithChange => product !== null);
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  const topIncreased = [...products]
    .filter((product) => product.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  const topDecreased = [...products]
    .filter((product) => product.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <main className="mx-auto w-full max-w-7xl px-3 sm:px-4 py-6">
      <ProductSection
        title="আজ দাম সবচেয়ে বেশি বেড়েছে"
        products={topIncreased}
        type="increased"
      />

      <ProductSection
        title="আজ দাম সবচেয়ে বেশি কমেছে"
        products={topDecreased}
        type="decreased"
      />

      <ProductSection
        title="সব পণ্য"
        products={products}
        type="all"
      />
    </main>
  );
}