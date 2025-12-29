
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
  const [dollars, cents] = priceStr.includes('.') ? priceStr.split('.') : [priceStr, '00'];

  // Determine font sizes based on the provided size mapping rules.
  // The prompt specifies a 5x4 aspect ratio.
  // The rules state:
  // - Small Signs (e.g., 4x5, 5x7): Title: 'text-2xl', Price: 'text-5xl', Detail: 'text-xs'. Layout: Vertical.
  // - Mandatory Limits: NEVER use 'text-6xl' or larger if the sign width is less than 6 inches.
  // Given 5x4, we assume a "small sign" category applies.

  const titleClass = 'text-2xl font-bold text-gray-800 leading-tight';
  const priceDollarsClass = 'text-5xl font-bold text-red-600';
  const priceCentsClass = 'text-3xl font-bold text-red-600 self-start mt-2';
  const detailClass = 'text-xs text-gray-600';
  const messageClass = 'text-sm text-gray-700';
  const promoClass = 'text-lg font-semibold text-green-600';
  const storeNameClass = 'text-base font-semibold text-gray-800';

  // For 5x4 aspect ratio, we'll use a vertical layout as per "Small Signs" rule.
  // Height > 3in implies flex-col, and 5x4 is likely in this category.
  const containerClasses = `w-full h-full p-3 flex flex-col items-center justify-center text-center overflow-hidden relative bg-white shadow-md rounded-lg`;

  return (
    <div className={containerClasses}>
      <div className="w-full flex flex-col items-center justify-center flex-grow">
        {/* Title */}
        <h1 className={`${titleClass} mb-1 line-clamp-2`}>
          {name}
        </h1>

        {/* Price */}
        <div className="flex items-baseline justify-center mb-2">
          <span className={`text-4xl font-bold text-red-600 mr-1`}>$</span>
          <span className={priceDollarsClass}>{dollars}</span>
          {cents && <span className={priceCentsClass}>.{cents}</span>}
        </div>

        {/* Promo */}
        {promo && <p className={`${promoClass} mb-2`}>{promo}</p>}

        {/* Details/Messages */}
        {(message1Content || message2Content) && (
          <div className="flex flex-col items-center justify-center mb-2">
            {message1Content && <p className={`${messageClass} mb-1`}>{message1Content}</p>}
            {message2Content && <p className={`${messageClass}`}>{message2Content}</p>}
          </div>
        )}
      </div>

      {/* Store Info Footer */}
      {(storeName || storeNum || storeAddress) && (
        <div className="w-full mt-auto pt-2 border-t border-gray-200 text-xs text-gray-500">
          {storeName && <p className="font-bold">{storeName}</p>}
          {(storeNum || storeAddress) && (
            <div className="flex justify-between">
              {storeNum && <span>#{storeNum}</span>}
              {storeAddress && <span>{storeAddress}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

CustomSign.size = "5x4";
export default CustomSign;
