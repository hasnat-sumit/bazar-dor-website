
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না");
      return;
    }

    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        const message =
          result.error.message || "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে";

        setError(message);
        toast.error(message);
        return;
      }

      toast.success("আপনার অ্যাকাউন্ট তৈরি হয়েছে!");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Email signup error:", err);
      setError("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
      toast.error("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (
    provider: "google" | "github"
  ) => {
    if (socialLoading) return;

    setError("");
    setSocialLoading(provider);

    try {
      console.log(`${provider} signup started`);

      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/sign-up",
      });

      if (result.error) {
        console.error(`${provider} signup error:`, result.error);

        const message =
          result.error.message ||
          `${provider} দিয়ে সাইন ইন করা যায়নি`;

        setError(message);
        toast.error(message);
        setSocialLoading(null);
      }
      // On success, Better Auth normally redirects the browser
      // to the OAuth provider. Do not reset loading before redirect.
    } catch (err) {
      console.error(`${provider} signup exception:`, err);

      setError("সোশ্যাল সাইন-আপ শুরু করা যায়নি। আবার চেষ্টা করুন।");
      toast.error("সোশ্যাল সাইন-আপ শুরু করা যায়নি। আবার চেষ্টা করুন।");
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f3] flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          বিনামূল্যে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        {error && (
          <div
            role="alert"
            className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg text-center"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label
              htmlFor="signup-name"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              নাম
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              required
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              ইমেইল
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
            />
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="signup-confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading || socialLoading !== null}
            className="w-full py-3 bg-[#088743] hover:bg-green-800 text-white font-medium rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "অপেক্ষা করুন..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-3 text-xs text-gray-500">
            অথবা
          </span>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => handleSocialSignIn("google")}
            type="button"
            disabled={loading || socialLoading !== null}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18A11 11 0 001 12c0 1.77.43 3.45 1.18 4.94l3.66-2.85z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {socialLoading === "google"
              ? "Google-এ সংযোগ করা হচ্ছে..."
              : "Google দিয়ে চালিয়ে যান"}
          </button>

          <button
            onClick={() => handleSocialSignIn("github")}
            type="button"
            disabled={loading || socialLoading !== null}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            {socialLoading === "github"
              ? "GitHub-এ সংযোগ করা হচ্ছে..."
              : "GitHub দিয়ে চালিয়ে যান"}
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/sign-in"
            className="text-green-700 font-semibold hover:underline"
          >
            সাইন ইন করুন
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
