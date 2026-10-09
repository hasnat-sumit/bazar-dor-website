
import Link from "next/link";

type Product = {
  id: string | number;
  nameBn: string;
  categoryIcon?: string | null;
  categoryNameBn?: string | null;
  today?: number | string | null;
  yesterday?: number | string | null;
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
  return (
    <section className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
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

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {products.map((product) => {
          const increased = product.change > 0;
          const decreased = product.change < 0;

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex min-w-0 flex-col justify-between rounded-xl border border-gray-200 bg-white p-3 transition hover:border-green-300 hover:shadow-sm sm:p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl">
                  {product.categoryIcon || "🛒"}
                </span>

                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                    {product.nameBn}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    {product.categoryNameBn || "নিত্যপ্রয়োজনীয় পণ্য"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[11px] text-gray-500">
                    আজকের দাম
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-gray-900">
                    {formatPrice(product.todayPrice)} টাকা
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
                    increased
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
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/products",
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error("পণ্যের তথ্য লোড করা যায়নি");
  }

  const result = await res.json();

  const rawProducts: Product[] = Array.isArray(result)
    ? result
    : result.products ?? result.data ?? [];

  const products: ProductWithChange[] = rawProducts
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

  // Section 1: Six largest percentage increases
  const topIncreased = [...products]
    .filter((product) => product.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);

  // Section 2: Six largest percentage decreases
  const topDecreased = [...products]
    .filter((product) => product.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  // Section 3: All products
  return (
    <main className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5">
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