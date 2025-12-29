
import React from 'react';

const CustomSign = ({ data }) => {
  const { name = '', price = 0, size = '', promo = '', message1Content = '', message2Content = '', storeName = '', storeNum = '', storeAddress = '' } = data || {};

  const priceStr = (price || '0.00').toString();
  const [dollars, cents] = priceStr.split('.');

  return (
    <div className="w-full h-full flex flex-col items-center justify-between overflow-hidden p-6 bg-white">
      {/* Top Section */}
      <div className="flex flex-col items-center text-center w-full">
        {promo && (
          <p className="text-red-600 font-black text-xl mb-1">
            {promo.toUpperCase()}
          </p>
        )}
        {name && (
          <h1 className="font-extrabold text-2xl text-gray-900 leading-tight line-clamp-2 uppercase">
            {name}
          </h1>
        )}
        {size && (
          <p className="text-gray-500 text-sm font-medium mt-1">
            {size}
          </p>
        )}
      </div>

      {/* Middle Content */}
      <div className="flex flex-col items-center text-center w-full gap-2 px-2">
        {message1Content && <p className="text-sm text-gray-700 line-clamp-2">{message1Content}</p>}
        {message2Content && <p className="text-sm text-gray-700 line-clamp-2">{message2Content}</p>}
      </div>

      {/* Bottom Section: Price */}
      <div className="flex flex-col items-center w-full">
        <div className="flex items-start text-red-600 font-black">
          <span className="text-2xl mt-1">$</span>
          <span className="text-6xl leading-none">{dollars}</span>
          <span className="text-2xl mt-1">.{cents}</span>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
          Plus Tax & Deposit
        </p>
      </div>

      {/* Footer: Store Info */}
      {(storeName || storeNum) && (
        <div className="w-full border-t border-gray-100 pt-3 mt-2 text-center">
          {storeName && <p className="text-[10px] font-bold text-gray-800 truncate">{storeName.toUpperCase()}</p>}
          {storeNum && <p className="text-[9px] text-gray-500">{storeNum}</p>}
        </div>
      )}
    </div>
  );
};

CustomSign.size = "4x5";
export default CustomSign;
