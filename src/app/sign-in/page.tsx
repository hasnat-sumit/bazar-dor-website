"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
        onError: (ctx) => {
          setError(ctx.error.message || "ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
          setLoading(false);
        },
      }
    );
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <div className="min-h-screen bg-[#f3f6f3] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          সাইন ইন করুন
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          বাজার দর অ্যাপে পুনরায় স্বাগতম।
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-4 p-3 text-xs text-red-600 bg-red-50 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              ইমেইল
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              required
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#088743] hover:bg-green-800 text-white font-medium rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "অপেক্ষা করুন..." : "সাইন ইন করুন"}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-500">
            অথবা
          </span>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => handleSocialSignIn("google")}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition-colors"
          >
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            onClick={() => handleSocialSignIn("github")}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition-colors"
          >
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/sign-up" className="text-green-700 font-semibold hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <Link
        href="/"
        className="text-xs text-gray-500 hover:text-gray-700 mt-6 flex items-center gap-1 transition-colors"
      >
        ← হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}