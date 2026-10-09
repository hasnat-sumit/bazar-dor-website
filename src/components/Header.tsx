import Image from 'next/image';
import React from 'react';
import NavLinks from './NavLinks';
import Link from 'next/link';

const Header = () => {
    const date = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
    });

    console.log(date);
    return (
        <header>
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 my-5">
                {/* Left Side: Logo + Title/Date */}
                <Link
                    href="/"
                    className="flex items-center gap-3 w-fit group hover:opacity-90 transition-opacity"
                >
                    <p className="border-none bg-green-600 px-2.5 py-2 rounded-xl text-lg">🛒</p>
                    <div>
                        <h2 className="text-lg font-bold group-hover:text-green-700 transition-colors">
                            বাজার দর
                        </h2>
                        <p className="text-sm text-gray-600">{date}</p>
                    </div>
                </Link>

                {/* Right Side: Auth Buttons */}
                <div className="flex items-center gap-2">
                    <button className="btn btn-success bg-gray-100 shadow-none border-none text-black hover:bg-gray-100">
                        সাইন ইন
                    </button>
                    <button className="btn btn-success bg-green-700 border-none text-white hover:bg-green-800">
                        সাইন আপ
                    </button>
                </div>

            </div>
            <NavLinks />
        </header>

    );
};

export default Header;