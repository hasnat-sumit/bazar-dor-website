import Image from 'next/image';

const Banner = () => {
    const date = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 my-4 sm:my-6">
            <section className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-8 md:p-10 shadow-sm">
                {/* Left content */}
                <div className="w-full md:flex-1 text-center md:text-left">
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs sm:text-sm font-medium text-green-700">
                        {date}
                    </span>

                    <h1 className="mt-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-gray-900">
                        আজকের বাজারের দাম এক নজরে
                    </h1>

                    <p className="mt-3 sm:mt-4 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-gray-600 mx-auto md:mx-0">
                        চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
                        বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
                        দামের পরিবর্তন এক জায়গায়।
                    </p>

                    <div className="mt-5 flex justify-center md:justify-start">
                        <button className="btn btn-sm sm:btn-md bg-green-700 hover:bg-green-800 border-none text-white shadow-md px-5">
                            সব পণ্য দেখুন
                        </button>
                    </div>
                </div>

                {/* Right illustration */}
                <div className="flex w-full justify-center md:w-[280px] lg:w-[320px] shrink-0">
                    <Image
                        src="/bazar-hero.png"
                        alt="বাজারের বিভিন্ন ফল ও সবজির চিত্র"
                        width={400}
                        height={250}
                        priority
                        className="h-auto w-48 sm:w-60 md:w-full object-contain"
                    />
                </div>
            </section>
        </div>
    );
};

export default Banner;