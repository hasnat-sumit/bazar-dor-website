
"use client";

import { useMemo, useState } from "react";

interface Product {
    id: string | number;
    nameBn?: string;
    productNameBn?: string;
    categoryNameBn: string;
    price?: number | string | null;
    currentPrice?: number | string | null;
    unit?: string;
    priceChangePercent?: number | string | null;
    [key: string]: unknown;
    today?: number | string | null;
}

type SortMode = "default" | "low-high" | "high-low";

function getPrice(product: Product): number {
    const value = product.today ?? product.price ?? 0;
    const price = Number(value);

    return Number.isFinite(price) ? price : 0;
}

function getProductName(product: Product): string {
    return product.nameBn ?? product.productNameBn ?? "নাম পাওয়া যায়নি";
}

export default function CategoryProducts({
    products,
}: {
    products: Product[];
}) {
    const [sortMode, setSortMode] = useState<SortMode>("default");

    const sortedProducts = useMemo(() => {
        // Keep the original API order in default mode.
        const result = [...products];

        if (sortMode === "low-high") {
            result.sort((a, b) => getPrice(a) - getPrice(b));
        } else if (sortMode === "high-low") {
            result.sort((a, b) => getPrice(b) - getPrice(a));
        }

        return result;
    }, [products, sortMode]);

    return (
        <section>
            {/* Sorting controls */}
            <div className="mb-4 flex items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white p-4">


                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="hidden sm:inline">সাজান</span>

                    <select
                        value={sortMode}
                        onChange={(event) =>
                            setSortMode(event.target.value as SortMode)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    >
                        <option value="default">ডিফল্ট</option>
                        <option value="low-high">দাম: কম থেকে বেশি</option>
                        <option value="high-low">দাম: বেশি থেকে কম</option>
                    </select>
                </label>
            </div>
            <p className="text-sm text-gray-500 mt-5 mb-5">
                মোট {sortedProducts.length}টি পণ্য
            </p>
            {/* Product grid */}
            {sortedProducts.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                    <p className="text-lg font-semibold text-gray-700">
                        এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        অন্য একটি ক্যাটাগরি নির্বাচন করুন।
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map((product) => {
                        const productImage =
                            typeof product.image === "string" && product.image.trim() !== ""
                                ? product.image
                                : "🥣";

                        return (
                            <article
                                key={product.id}
                                className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                            >
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f5f1] text-2xl">
                                        {productImage}
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-gray-800">
                                            {getProductName(product)}
                                        </h2>
                                        <p className="text-xs text-gray-500">
                                            {product.unit ?? "প্রতি একক"}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500">আজকের দাম</p>

                                <p className="mt-1 text-lg font-bold text-gray-900">
                                    {getPrice(product).toLocaleString("bn-BD")} টাকা
                                </p>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}