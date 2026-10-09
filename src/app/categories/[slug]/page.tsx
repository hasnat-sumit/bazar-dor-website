
import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";

const API = "https://api.api-store.workers.dev/api/bazardor";

interface Category {
  id: string | number;
  slug: string;
  nameBn: string;
  image?: string;
  categoryIcon?: string;
}

interface Product {
  id: string | number;
  nameBn?: string;
  productNameBn?: string;
  categoryNameBn: string;
  price?: number | string | null;
  currentPrice?: number | string | null;
  unit?: string;
  [key: string]: unknown;
}

async function getJSON(url: string) {
  const res = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [categoryResponse, productResponse] = await Promise.all([
    getJSON(`${API}/categories`),
    getJSON(`${API}/products`),
  ]);

  const categories: Category[] = Array.isArray(categoryResponse)
    ? categoryResponse
    : categoryResponse.categories ?? categoryResponse.data ?? [];

  const allProducts: Product[] = Array.isArray(productResponse)
    ? productResponse
    : productResponse.products ?? productResponse.data ?? [];

  const selectedCategory = categories.find(
    (category) => category.slug === decodeURIComponent(slug)
  );

  if (!selectedCategory) {
    notFound();
  }

  const filteredProducts = allProducts.filter(
    (product) =>
      product.categoryNameBn?.trim() === selectedCategory.nameBn.trim()
  );

  return (
    <main className="min-h-screen bg-[#f0f5f1] px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5">
          <span className="text-3xl">
            {selectedCategory.categoryIcon || "🛒"}
          </span>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {selectedCategory.nameBn}
            </h1>

            <p className="text-sm text-gray-500">
              {filteredProducts.length}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        <CategoryProducts products={filteredProducts} />
      </div>
    </main>
  );
}