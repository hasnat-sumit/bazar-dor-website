
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="text-6xl" aria-hidden="true">
        🛒
      </span>

      <h1 className="mt-5 text-3xl font-bold text-gray-900">
        404 — পেজটি খুঁজে পাওয়া যায়নি
      </h1>

      <p className="mt-3 max-w-md text-gray-600">
        দুঃখিত! আপনি যে পেজটি খুঁজছেন, সেটি পাওয়া যায়নি
        অথবা ঠিকানাটি ভুল।
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-lg bg-green-700 px-5 py-3 font-medium text-white transition hover:bg-green-800"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </main>
  );
}
