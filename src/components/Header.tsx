"use client";

import Link from "next/link";
import NavLinks from "./NavLinks";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  // Fetch session data from Better Auth
  const { data: session, isPending } = authClient.useSession();

  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:my-5">
        {/* Left Side: Logo + Title/Date */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 w-fit group hover:opacity-90 transition-opacity"
        >
          <span className="bg-green-600 p-2 sm:px-2.5 sm:py-2 rounded-xl text-base sm:text-lg">
            🛒
          </span>
          <div>
            <h2 className="text-base sm:text-lg font-bold group-hover:text-green-700 transition-colors">
              বাজার দর
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">{date}</p>
          </div>
        </Link>

        {/* Right Side: Auth Buttons */}
        <div className="flex items-center gap-2 min-h-[36px]">
          {isPending ? (
            /* Subtle loader while checking session */
            <div className="h-8 w-20 bg-gray-100 animate-pulse rounded-lg" />
          ) : session?.user ? (
            /* Logged In View */
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 hidden sm:inline-block">
                {session.user.name}
              </span>
              <button
                onClick={handleSignOut}
                className="btn btn-sm sm:btn-md bg-red-50 text-red-600 hover:bg-red-100 border-none rounded-xl"
              >
                সাইন আউট
              </button>
            </div>
          ) : (
            /* Logged Out View - Sign In & Sign Up Buttons */
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <button className="btn btn-sm sm:btn-md bg-gray-100 border-none text-black hover:bg-gray-200 rounded-xl">
                  সাইন ইন
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="btn btn-sm sm:btn-md bg-[#088743] border-none text-white hover:bg-green-800 rounded-xl">
                  সাইন আপ
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <NavLinks />
    </header>
  );
};

export default Header;