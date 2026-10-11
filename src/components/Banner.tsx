"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import DateLabel from "./DateLabel";

const Banner = () => {
  const router = useRouter();

  return (
    <div className="mx-auto my-4 w-full max-w-7xl px-3 sm:my-6 sm:px-4">
      <section className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:gap-8 sm:p-8 md:flex-row md:p-10">
        {/* Left content */}
        <div className="w-full text-center md:flex-1 md:text-left">
          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 sm:text-sm">
            <DateLabel />
          </span>

          <h1 className="mt-3 text-xl font-bold leading-tight text-gray-900 sm:text-2xl md:text-3xl lg:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-gray-600 sm:mt-4 sm:text-sm md:mx-0 md:text-base">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
            বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
            দামের পরিবর্তন এক জায়গায়।
          </p>

          <div className="mt-5 flex justify-center md:justify-start">

            <a
              href="#sob-ponno"
              className="btn btn-sm border-none bg-green-700 px-5 text-white shadow-md hover:bg-green-800 sm:btn-md"
            >
              সব পণ্য দেখুন
            </a>

          </div>
        </div>

        {/* Right illustration */}
        <div className="flex w-full shrink-0 justify-center md:w-[280px] lg:w-[320px]">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের বিভিন্ন ফল ও সবজির চিত্র"
            width={400}
            height={250}
            priority
            className="h-auto w-48 object-contain sm:w-60 md:w-full"
          />
        </div>
      </section>
    </div>
  );
};

export default Banner;
