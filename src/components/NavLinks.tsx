import Link from "next/link";

// Definition for Category item type
interface Category {
  id?: string | number;
  slug: string;
  icon?: string;
  nameBn: string;
}

const NavLinks = async () => {
  let categories: Category[] = [];

  try {
    const res = await fetch(
      "https://api.api-store.workers.dev/api/bazardor/categories",
      { next: { revalidate: 300 } }
    );

    if (res.ok) {
      const response = await res.json();
      categories = Array.isArray(response)
        ? response
        : response.categories ?? response.data ?? [];
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  if (!categories || categories.length === 0) {
    return null; // Return null or a subtle loading/empty UI if no categories
  }

  return (
    <nav className="border-y border-gray-200 bg-white w-full">
      <div className="w-full max-w-7xl mx-auto overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center justify-start md:justify-center gap-3 sm:gap-5 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700">
          {categories.map((category, index) => (
            <Link
              key={category.id ?? index}
              href={`/categories/${encodeURIComponent(category.slug)}`}
              scroll={true}
              className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap transition-colors hover:text-green-700 focus:text-green-700 px-1 py-0.5 rounded-md"
            >
              {category.icon && (
                <span className="text-base sm:text-lg" aria-hidden="true">
                  {category.icon}
                </span>
              )}
              <span>{category.nameBn}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavLinks;