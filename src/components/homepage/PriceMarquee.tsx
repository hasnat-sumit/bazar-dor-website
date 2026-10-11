
import Link from "next/link";

type Product = {
  id: string | number;
  nameBn: string;
  categoryIcon?: string | null;
  today?: number | string | null;
  yesterday?: number | string | null;
};

function formatPrice(value: number) {
  return value.toLocaleString("bn-BD", {
    maximumFractionDigits: 2,
  });
}

export default async function PriceMarquee() {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/products",
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error("পণ্যের দাম লোড করা যায়নি");
  }

  const result = await res.json();

  const products: Product[] = Array.isArray(result)
    ? result
    : result.products ?? result.data ?? [];

  const items = products.map((product) => {
    const today = Number(product.today);
    const yesterday = Number(product.yesterday);

    const validToday =
      product.today != null &&
      product.today !== "" &&
      Number.isFinite(today);

    const validYesterday =
      product.yesterday != null &&
      product.yesterday !== "" &&
      Number.isFinite(yesterday) &&
      yesterday > 0;

    const change =
      validToday && validYesterday
        ? ((today - yesterday) / yesterday) * 100
        : null;

    return {
      ...product,
      today,
      validToday,
      change,
    };
  });

  if (items.length === 0) return null;

  return (
    <div
      className="w-full overflow-hidden border-y border-gray-200 bg-white py-3"
      aria-label="আজকের বাজারদর"
    >
      <div className="price-marquee-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {items.map((product, index) => {
              const increased =
                product.change !== null && product.change > 0;

              const decreased =
                product.change !== null && product.change < 0;

              return (
                <Link
                  key={`${copy}-${product.id ?? index}`}
                  href={`/products/${product.id}`}
                  tabIndex={copy === 1 ? -1 : undefined}
                  className="flex shrink-0 items-center gap-1.5 border-r border-gray-200 px-4 text-xs sm:px-5 sm:text-sm"
                >
                  {product.categoryIcon && (
                    <span className="text-xl" aria-hidden="true">
                      {product.categoryIcon}
                    </span>
                  )}

                  <span className="font-semibold text-gray-800">
                    {product.nameBn}
                  </span>

                  <span className="whitespace-nowrap text-gray-500">
                    {product.validToday
                      ? `${formatPrice(product.today)} টাকা`
                      : "দাম নেই"}
                  </span>

                  {product.change === null ? (
                    <span className="whitespace-nowrap text-gray-400">
                      — তথ্য নেই
                    </span>
                  ) : (
                    <span
                      className={`whitespace-nowrap font-bold ${
                        increased
                          ? "text-red-600"
                          : decreased
                            ? "text-green-600"
                            : "text-gray-500"
                      }`}
                    >
                      {increased ? "▲ +" : decreased ? "▼ " : ""}
                      {Math.abs(product.change).toLocaleString("bn-BD", {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                      %
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
