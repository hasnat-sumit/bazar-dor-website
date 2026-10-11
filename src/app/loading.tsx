
import ProductSkeleton from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-3 py-6 sm:px-4">
      <div className="mb-6 animate-pulse">
        <div className="h-7 w-40 rounded bg-gray-200" />
        <div className="mt-3 h-4 w-64 max-w-full rounded bg-gray-100" />
      </div>

      <ProductSkeleton count={6} />
    </main>
  );
}
