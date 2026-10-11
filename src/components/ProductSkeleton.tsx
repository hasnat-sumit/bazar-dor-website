
export default function ProductSkeleton({
  count = 6,
}: {
  count?: number;
}) {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
      aria-label="পণ্যের তথ্য লোড হচ্ছে"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-100" />
            </div>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-4">
            <div className="h-3 w-1/4 rounded bg-gray-100" />
            <div className="mt-2 h-5 w-1/2 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
