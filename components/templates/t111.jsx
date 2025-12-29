
import React from 'react';

const CustomSign = ({ data }) => {
  const {
    name = '',
    price = 0,
    size = '',
    promo = '',
    message1Content = '',
    message2Content = '',
    storeName = '',
    storeNum = '',
    storeAddress = '',
  } = data || {};

  const priceStr = (price || '0.00').toString();
  const [dollars, cents] = priceStr.split('.');

  const titleSize = 'text-base';
  const detailSize = 'text-[9px]';
  const priceSize = 'text-xl';
  const padding = 'p-2';

  return (
    <div className={`${padding} w-full h-full flex flex-row items-center justify-between bg-white rounded shadow-sm overflow-hidden border border-gray-100`}>
      {/* Left Section: Product Info */}
      <div className="flex flex-col justify-center text-left min-w-0 flex-1">
        <h1 className={`${titleSize} font-bold text-gray-800 truncate leading-tight`}>{name}</h1>
        <div className="flex flex-col">
          {message1Content && <p className={`${detailSize} text-gray-600 truncate`}>{message1Content}</p>}
          {message2Content && <p className={`${detailSize} text-gray-600 truncate`}>{message2Content}</p>}
        </div>
      </div>

      {/* Middle Section: Promo */}
      {promo && (
        <div className="mx-2 px-2 py-1 bg-red-100 text-red-600 font-bold rounded text-[10px] whitespace-nowrap">
          {promo}
        </div>
      )}

      {/* Right Section: Price & Store */}
      <div className="flex flex-col items-end justify-center ml-2 border-l pl-2 border-gray-100">
        <div className="flex items-baseline text-red-600">
          <span className="text-xs font-bold leading-none">$</span>
          <span className={`${priceSize} font-black leading-none`}>{dollars}</span>
          <span className="text-[10px] font-bold leading-none">.{cents}</span>
        </div>
        <div className="text-[7px] text-gray-400 mt-0.5 whitespace-nowrap">
          {storeName || 'Store'}
        </div>
      </div>
    </div>
  );
};

CustomSign.size = "4x1";
export default CustomSign;
