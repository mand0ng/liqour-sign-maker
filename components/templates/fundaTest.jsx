import React from 'react';


const CustomSign = ({ data = {} }) => {
  const {
    name = 'Product Name',
    price = '0.00',
    size = 'N/A',
    promo = '',
    storeName = 'Store Name',
    storeNum = '',
    storeAddress = 'Store Address',
  } = data;

  return (
    <div className="relative w-full h-full bg-white shadow-lg p-6 font-sans text-gray-800">

      <div className="flex flex-col items-center justify-center text-center">

        <p className="text-xl font-semibold mb-2">GREAT PRICE!!</p>


        <h1 className="text-6xl font-bold mb-4 uppercase">{name}</h1>


        <div className="text-2xl italic mb-6">
          <p>FROM PHILLIPPINES</p>
          <p>BLUE POMELO &</p>
          <p>MOJITO</p>
        </div>


        <p className="text-2xl mb-8">{size}</p>


        <div className="text-8xl font-bold text-red-600 flex items-center mb-6">
          ${price}
        </div>


        <p className="text-lg mb-2">PLUS TAX AND DEPOSIT</p>


        <div className="absolute bottom-6 left-0 right-0 px-6 text-center">
          <p className="font-bold text-xl">{storeName}</p>
          <p className="text-lg">{storeAddress}</p>
          {storeNum && <p className="text-lg">{storeNum}</p>}
        </div>
      </div>
    </div>
  );
};

CustomSign.size = "8.5x11";

export default CustomSign;