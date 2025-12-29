import React from 'react';

SignCard.size = "8.5x11";

export default function SignCard({ data }) {
    // data expected: { name, price, size, promo, storeName, storeNum, storeAddress, message1Status, message1Content, message2Status, message2Content }
    const isPromo = data.promo && data.promo.toString().toLowerCase() !== "no";
    const showMessage1 = data.message1Status && data.message1Status.toString().toLowerCase() === "yes";
    const showMessage2 = data.message2Status && data.message2Status.toString().toLowerCase() === "yes";

    return (
        <div className="w-full h-full bg-white text-black relative flex flex-col items-center justify-between p-12 border border-gray-200 shadow-sm print:shadow-none print:border-none mx-auto overflow-hidden">

            {/* Message 1 (Top) */}
            {showMessage1 && (
                <div className="absolute top-0 w-full bg-black text-white text-center py-2 z-20">
                    <p className="text-xl font-bold uppercase tracking-[0.2em]">{data.message1Content}</p>
                </div>
            )}

            {/* Promo Badge */}
            {isPromo && (
                <div className="absolute top-12 right-0 bg-red-600 text-white font-bold px-12 py-3 transform rotate-45 translate-x-12 translate-y-8 text-xl shadow-md z-10 print:bg-red-600 print:text-white">
                    SALE
                </div>
            )}

            {/* Header border design */}
            <div className={`w-full border-b-4 border-black mb-8 ${showMessage1 ? 'mt-8' : ''}`}></div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-center text-center w-full space-y-6">

                {/* Item Name */}
                <h1 className="text-6xl font-black uppercase tracking-tight leading-tight line-clamp-3">
                    {data.name || "Item Name"}
                </h1>

                {/* Size */}
                <p className="text-4xl font-medium text-gray-600">
                    {data.size || "Size"}
                </p>

                {/* Price */}
                <div className="mt-8 relative">
                    <span className="text-3xl align-top font-bold mr-1">$</span>
                    <span className="text-[10rem] font-black leading-none tracking-tighter text-black">
                        {data.price || "0.00"}
                    </span>
                </div>

                {isPromo && (
                    <p className="text-2xl text-red-600 font-bold uppercase tracking-widest mt-4">
                        Limited Time Offer
                    </p>
                )}

                {showMessage2 && (
                    <div className="mt-6 border-t-2 border-gray-300 pt-4 w-3/4">
                        <p className="text-3xl font-bold text-black italic">"{data.message2Content}"</p>
                    </div>
                )}

            </div>

            {/* Footer / Store Info */}
            <div className="w-full text-center mt-8 border-t-4 border-black pt-6">
                <h2 className="text-2xl font-bold uppercase tracking-widest mb-1">
                    {data.storeName || "Liquor Store"}
                </h2>
                <p className="text-lg font-medium text-gray-500">
                    Store #{data.storeNum || "000"} • {data.storeAddress || "123 Main St"}
                </p>
            </div>

        </div>
    );
}
