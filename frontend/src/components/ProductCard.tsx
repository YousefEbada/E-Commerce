import React from "react";

type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  amount: number; // local selected quantity
};

type Props = {
  product: Product;
  onChangeAmount: (nextAmount: number) => void;
  onAddToCart: (quantity: number) => void;
};

const ProductCard = ({ product, onChangeAmount, onAddToCart }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-800">{product.title}</h3>
      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-indigo-700 font-semibold">${Number(product.price).toFixed(2)}</span>
      </div>
      <div className="flex items-center space-x-2 mt-3">
        <input
          type="number"
          min={1}
          value={product.amount}
          className="border rounded px-2 py-1 w-20"
          onChange={(e) => onChangeAmount(Math.max(1, Number(e.target.value) || 1))}
        />
        <button
          onClick={() => onAddToCart(Math.max(1, Number(product.amount) || 1))}
          className="bg-indigo-600 text-white px-3 py-1.5 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
