
import Link from "next/link";

const NavLinks = async () => {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/categories",
    { next: { revalidate: 300 } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const response = await res.json();
  const categories = Array.isArray(response)
    ? response
    : response.categories ?? response.data ?? [];

  return (
    <nav className="mt-5 overflow-x-auto border-y border-gray-200 bg-white">
      <div className="flex min-w-max items-center justify-center gap-5 px-4 py-3">
        {categories.map((category: any, index: number) => (
          <Link
            key={category.id ?? index}
            href={`/categories/${encodeURIComponent(category.slug)}`}
            scroll={true}
            className="flex items-center gap-2 whitespace-nowrap transition-colors hover:text-green-700"
          >
            {category.icon && (
              <span aria-hidden="true">{category.icon}</span>
            )}
            <span>{category.nameBn}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavLinks;