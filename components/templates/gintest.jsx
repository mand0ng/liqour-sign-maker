
import React from 'react';

CustomSign.size = "8.5x11";

function CustomSign({ data }) {
  const {
    name = 'PRODUCT NAME',
    price = 'XX.XX',
    size = 'XXX ML',
    promo,
    message1Status,
    message1Content,
    message2Status,
    message2Content,
    storeName = 'STORE NAME',
    storeNum = '(XXX) XXX-XXXX',
    storeAddress = 'STORE ADDRESS, CITY, POSTAL CODE',
  } = data || {};

  const showMessage1 = message1Status && message1Status.toString().toLowerCase() === 'yes';
  const showMessage2 = message2Status && message2Status.toString().toLowerCase() === 'yes';

  return (
    <div className="relative overflow-hidden p-6 mx-auto w-full h-full flex flex-col">

      {/* Message 1 (Top) */}
      {showMessage1 && (
        <div className="absolute top-0 left-0 w-full bg-yellow-400 text-center py-2 border-b-2 border-black z-20">
          <p className="text-2xl font-black uppercase text-black tracking-widest">{message1Content}</p>
        </div>
      )}

      <div className={`text-center mb-4 ${showMessage1 ? 'mt-12' : ''}`}>
        {/* Placeholder removed in favor of Message 1 if active, or just layout spacing */}
      </div>

      <div className="text-center mb-4 mt-8">
        <h1 className="text-6xl font-extrabold text-gray-900 uppercase leading-none">{name}</h1>
      </div>

      {/* Size moved up slightly */}
      <div className="text-center mb-2">
        <p className="text-3xl font-medium text-gray-500">{size}</p>
      </div>

      <div className="text-center mb-6">
        <p className="text-[8rem] font-bold text-red-600 flex items-center justify-center leading-none">
          <span className="text-5xl mr-2 mt-4 text-black">$</span>
          {price}
        </p>
      </div>

      <div className="text-center mb-4">
        <p className="text-xl font-semibold text-gray-600">PLUS TAX AND DEPOSIT</p>
      </div>

      {promo && promo.toString().toUpperCase() !== 'NO' && (
        <div className="text-center mb-8">
          <span className="inline-block bg-red-600 text-white text-3xl font-black py-2 px-8 rounded-full transform -rotate-2 shadow-lg border-2 border-red-800">
            {promo.toString().toUpperCase() === 'YES' ? 'GREAT VALUE' : promo.toUpperCase()}
          </span>
        </div>
      )}

      {/* Message 2 (Bottom Area) */}
      {showMessage2 && (
        <div className="text-center mb-8 border-t-2 border-b-2 border-gray-200 py-4 bg-gray-50">
          <p className="text-3xl font-bold text-blue-900 italic">"{message2Content}"</p>
        </div>
      )}

      <div className="text-center text-sm text-gray-700 mt-auto pt-8 border-t-4 border-black pb-8">
        <p className="font-bold text-2xl mb-1">{storeName}</p>
        <p className="text-lg">{storeNum} • {storeAddress}</p>
      </div>
    </div>
  );
}

export default CustomSign;
