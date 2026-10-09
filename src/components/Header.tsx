import Image from 'next/image';
import React from 'react';
import NavLinks from './NavLinks';

const Header = () => {
    const date = new Date().toLocaleDateString("bn-BD", {
        dateStyle: "full",
    });

    console.log(date);
    return (
        <header>
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4 my-5">
                {/* Left Side: Logo + Title/Date */}
                <div className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="logo"
                        height={40}
                        width={40}
                        className="object-contain w-auto h-10"
                    />
                    <div>
                        <h2 className="text-lg font-bold">বাজার দর</h2>
                        <p className="text-sm text-gray-600">{date}</p>
                    </div>
                </div>

                {/* Right Side: Auth Buttons */}
                <div className="flex items-center gap-2">
                    <button className="btn btn-success bg-white border-none text-black hover:bg-gray-100">
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