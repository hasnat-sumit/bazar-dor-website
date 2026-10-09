import Image from 'next/image';
import React from 'react';

const Banner = () => {
    const date = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
    });
    return (
        <div className="container mx-auto mt-5 mb-5 px-3 sm:px-4">
            <section className="flex flex-col-reverse items-center justify-between gap-6 rounded-2xl border border-gray-200 bg-white px-5 py-6 sm:px-8 md:flex-row md:gap-8 md:px-6 md:py-5">
                {/* Left content */}
                <div className="w-full md:flex-1">
                    <span className="items-center inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {date}
                    </span>

                    <h1 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                        আজকের বাজারের দাম এক নজরে
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
                        বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
                        দামের পরিবর্তন এক জায়গায়।
                    </p>

                    <button className="btn mt-5 min-h-9 h-9 border-none bg-green-700 px-4 text-sm text-white shadow-md hover:bg-green-800">
                        সব পণ্য দেখুন
                    </button>
                </div>

                {/* Right illustration */}
                <div className="flex w-full justify-center md:w-[220px] md:shrink-0">
                    <Image
                        src="/bazar-hero.png"
                        alt="বাজারের বিভিন্ন ফল ও সবজির চিত্র"
                        width={400}
                        height={250}
                        priority
                        className="h-auto w-48 object-contain sm:w-56 md:w-full"
                    />
                </div>
            </section>
        </div>
    );
};

export default Banner;