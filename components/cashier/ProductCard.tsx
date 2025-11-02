// components/cashier/ProductCard.tsx

'use client';

import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        bg-white rounded-xl p-4 border-2 border-gray-200
        hover:border-blue-500 hover:shadow-lg
        transition-all duration-200
        flex flex-col items-center gap-3
        active:scale-95
        w-full
      "
    >
      {/* Emoji Icon */}
      <div className="text-6xl">
        {product.emoji}
      </div>

      {/* Product Name */}
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 text-sm">
          {product.name}
        </h3>
      </div>

      {/* Price */}
      <div className="text-2xl font-bold text-blue-600">
        {product.price} ₺
      </div>

      {/* Token Info */}
      <div className="text-xs text-green-600 font-medium">
        💰 +{(product.price * product.cashbackRate).toFixed(2)} UNIP
      </div>

      {/* Stock (if low) */}
      {product.stock !== undefined && product.stock < 10 && (
        <div className="text-xs text-red-500">
          Stok: {product.stock}
        </div>
      )}
    </button>
  );
}

