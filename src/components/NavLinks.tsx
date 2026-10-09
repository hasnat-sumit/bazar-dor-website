
import Link from "next/link";

const NavLinks = async () => {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/categories"
  );

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await res.json();

  return (
    <div className="mt-5 flex justify-center gap-5 border-1 border-gray-300 py-2    ">
      {data.map((n: any, i: number) => (
        <Link
          key={n.id || i}
          href={n.slug}
          className="flex items-center gap-2 transition-colors hover:text-green-700"
        >
          {n.icon && (
            <span className="text-xl" aria-hidden="true">
              {n.icon}
            </span>
          )}

          <span>{n.nameBn}</span>
        </Link>
      ))}
    </div>
  );
};

export default NavLinks;