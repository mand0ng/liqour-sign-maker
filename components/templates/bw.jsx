
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

  // Inferring font sizes based on the 4x3 aspect ratio and typical use cases.
  // Since the user specified 4x3, and this is likely a shelf talker, we'll assume
  // a smaller aspect ratio where specific font sizes are needed.
  // We will use text-3xl for the name, text-6xl for the dollar price, and text-xl for cents.
  // Message content will be text-sm.
  const titleSize = 'text-3xl'; // Assuming name is the main title
  const priceDollarsSize = 'text-6xl'; // Large price
  const priceCentsSize = 'text-xl'; // Smaller cents
  const detailSize = 'text-sm'; // For promo, messages, store info
  const promoSize = 'text-lg'; // For promo banner

  return (
    <div
      className={`w-full h-full p-4 flex flex-col items-center justify-between overflow-hidden bg-white rounded-lg shadow-xl`}
      style={{ aspectRatio: '4 / 3' }}
    >
      {/* Top Section: Store Info */}
      <div className="w-full flex justify-between items-center text-gray-600">
        <div className="flex flex-col">
          {storeName && <span className={`${detailSize} font-bold line-clamp-1`}>{storeName}</span>}
          {(storeNum || storeAddress) && (
            <span className={`${detailSize} font-light line-clamp-1`}>
              {storeNum} {storeNum && storeAddress && '|'} {storeAddress}
            </span>
          )}
        </div>
        {promo && (
          <div className="bg-red-500 text-white px-3 py-1 rounded-md flex items-center">
            <span className={`${promoSize} font-bold`}>SAVE</span>
            <span className={`${promoSize} font-bold ml-1`}>{promo}%</span>
          </div>
        )}
      </div>

      {/* Middle Section: Product Name & Description */}
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        {name && (
          <h1 className={`${titleSize} font-bold text-gray-800 leading-tight line-clamp-2`}>
            {name}
          </h1>
        )}
        {(message1Content || message2Content) && (
          <div className="flex flex-col mt-2">
            {message1Content && (
              <p className={`${detailSize} text-gray-500 line-clamp-1`}>
                {message1Content}
              </p>
            )}
            {message2Content && (
              <p className={`${detailSize} text-gray-500 line-clamp-1`}>
                {message2Content}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Section: Price */}
      <div className="w-full flex items-baseline justify-center text-gray-800 font-bold">
        <span className="text-4xl mr-1">$</span>
        <span className={`${priceDollarsSize} leading-none`}>{dollars}</span>
        <span className={`ml-1 ${priceCentsSize} self-start leading-none`}>.{cents}</span>
      </div>
    </div>
  );
};

CustomSign.size = "4x3";
export default CustomSign;
