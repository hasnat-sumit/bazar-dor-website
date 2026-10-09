import Link from "next/link";

type Product = {
    id: string | number;
    nameBn: string;
    categoryIcon?: string | null;
    categoryNameBn?: string | null;
    today?: number | string | null;
    yesterday?: number | string | null;
    slug?: string | null;
};

function formatPrice(value: number) {
    return `৳${value.toLocaleString("bn-BD", {
        maximumFractionDigits: 2,
    })}`;
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

    const products: Product[] = Array.isArray(result)
        ? result
        : result.products ?? result.data ?? [];

    return (
        <section className="mx-auto w-full max-w-7xl px-3 py-5 sm:px-5">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                    সব পণ্য
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    মোট ৩৩টি পণ্য দেখানো হচ্ছে
                </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {products.map((product) => {
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

                    const increased = change !== null && change > 0;
                    const decreased = change !== null && change < 0;

                    return (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="flex min-w-0 flex-col justify-between rounded-xl border border-gray-200 bg-white p-3 transition hover:border-green-300 hover:shadow-md sm:p-4"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                {product.categoryIcon && (
                                    <span className="text-xl" aria-hidden="true">
                                        {product.categoryIcon}
                                    </span>
                                )}

                                <div className="min-w-0">
                                    <h3 className="line-clamp-2 break-words text-xs font-bold leading-5 text-gray-900 sm:text-sm">
                                        {product.nameBn}
                                    </h3>

                                    <p className="mt-0.5 line-clamp-1 text-[10px] text-gray-500 sm:text-xs">
                                        {product.categoryNameBn || "নিত্যপ্রয়োজনীয় পণ্য"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-[10px] text-gray-500 sm:text-xs">
                                    আজকের দাম
                                </p>
                                <div className=" flex justify-between items-center">
                                    <p className="mt-0.5 break-words text-sm font-bold text-gray-900 sm:text-base">
                                        {validToday ? formatPrice(today) : "দাম পাওয়া যায়নি"}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-1 border-t border-gray-100 pt-2">
                                        {change === null ? (
                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-500">
                                                তথ্য নেই
                                            </span>
                                        ) : (
                                            <span
                                                className={`rounded-full px-2 py-1 text-[10px] font-semibold sm:text-xs ${increased
                                                        ? "bg-red-50 text-red-600"
                                                        : decreased
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {increased ? "▲ +" : decreased ? "▼ " : ""}
                                                {Math.abs(change).toLocaleString("bn-BD", {
                                                    maximumFractionDigits: 2,
                                                })}
                                                %
                                            </span>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}