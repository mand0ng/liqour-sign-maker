
import React from 'react';

function CustomSign({ data }) {
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

  // Determine font size based on size mapping rules
  let titleSize = 'text-xl'; // Default for small signs
  let detailSize = 'text-xs';
  let layoutClasses = 'flex-col items-center text-center'; // Default vertical
  let priceSize = 'text-5xl';

  // Hardcoded for 3x3 as per instructions
  const signHeight = 3; // inches
  const signWidth = 3; // inches

  // Applying size-to-font mapping for 3x3 sign
  if (signWidth < 6) { // Constraint for text-6xl and larger
      titleSize = 'text-2xl'; // Use 2xl for small signs
  } else {
      titleSize = 'text-6xl'; // Standard Posters size
  }
  priceSize = 'text-5xl'; // Small Signs price size
  detailSize = 'text-xs'; // Small Signs detail size

  // Layout adjustments based on height
  if (signHeight > 3) {
    layoutClasses = 'flex-col items-center text-center';
  } else if (signHeight < 2) {
    layoutClasses = 'flex-row items-center justify-between';
    titleSize = 'text-sm'; // Shelf Talkers title size
    priceSize = 'text-xl'; // Shelf Talkers price size
    detailSize = 'text-[8px]'; // Shelf Talkers detail size
  } else {
    layoutClasses = 'flex-col items-center text-center'; // Standard Posters vertical
  }

  return (
    <div className={`w-full h-full p-2 flex ${layoutClasses} overflow-hidden bg-white rounded-lg shadow-lg`}>
      {/* Top Section: Store Info */}
      {(storeName || storeNum || storeAddress) && (
        <div className={`text-gray-700 ${layoutClasses.includes('flex-row') ? 'mr-4' : 'mb-2'}`}>
          {storeName && <div className="font-bold text-base">{storeName}</div>}
          {(storeNum || storeAddress) && (
            <div className={`text-xs ${layoutClasses.includes('flex-row') ? 'flex items-center' : 'flex flex-col items-center'}`}>
              {storeNum && <span className="mr-1">{storeNum}</span>}
              {storeAddress && <span>{storeAddress}</span>}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-grow flex ${layoutClasses.includes('flex-row') ? 'flex-row items-center' : 'flex-col items-center justify-center text-center'} `}>
        <div className={`flex-1 ${layoutClasses.includes('flex-row') ? 'mr-4' : 'mb-2'}`}>
          {/* Product Name / Title */}
          {name && (
            <h1 className={`${titleSize} font-bold text-gray-900 leading-tight line-clamp-2`}>
              {name}
            </h1>
          )}

          {/* Messages / Details */}
          {(message1Content || message2Content) && (
            <div className={`text-gray-600 ${detailSize} ${layoutClasses.includes('flex-row') ? 'mt-1' : 'mt-1'}`}>
              {message1Content && <p className="line-clamp-2">{message1Content}</p>}
              {message2Content && <p className="line-clamp-2">{message2Content}</p>}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className={`flex-shrink-0 flex items-baseline ${layoutClasses.includes('flex-row') ? 'ml-4' : 'mt-2'}`}>
          {promo && (
            <span className="text-red-600 font-bold text-xl mr-2 rotate-[-10deg]">{promo}</span>
          )}
          <span className={`font-bold text-gray-900 ${priceSize}`}>${dollars}.</span>
          <span className={`font-bold text-gray-900 ${priceSize} leading-none`}>{cents}</span>
        </div>
      </div>
    </div>
  );
}

CustomSign.size = "3x3";
export default CustomSign;
