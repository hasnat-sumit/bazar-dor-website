
import Link from "next/link";
import NavLinks from "./NavLinks";
import AuthControls from "./AuthControls";
import DateLabel from "./DateLabel";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-xs">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 sm:px-4">
        {/* Logo and date */}
        <Link
          href="/"
          className="group flex w-fit items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3"
        >
          <span className="flex items-center justify-center rounded-xl bg-green-600 p-2 text-base text-white sm:px-2.5 sm:py-2 sm:text-lg">
            🛒
          </span>

          <div>
            <h2 className="text-base font-bold transition-colors group-hover:text-green-700 sm:text-lg">
              বাজার দর
            </h2>
            <DateLabel />
          </div>
        </Link>

        {/* Interactive authentication controls */}
        <AuthControls />
      </div>

      {/* Async Server Component */}
      <NavLinks />
    </header>
  );
};

export default Header;
