// components/cashier/CartItem.tsx

'use client';

import { CartItem } from '@/lib/types';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItemComponent({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
      {/* Emoji */}
      <div className="text-3xl">
        {product.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 text-sm truncate">
          {product.name}
        </h4>
        <p className="text-xs text-gray-500">
          {product.price} ₺ × {quantity}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
          className="
            w-8 h-8 rounded-lg bg-white border border-gray-300
            hover:bg-gray-100 transition-colors
            font-bold text-gray-700
            flex items-center justify-center
          "
        >
          −
        </button>
        <span className="w-8 text-center font-bold text-gray-900">
          {quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
          className="
            w-8 h-8 rounded-lg bg-white border border-gray-300
            hover:bg-gray-100 transition-colors
            font-bold text-gray-700
            flex items-center justify-center
          "
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="font-bold text-gray-900">
          {subtotal.toFixed(2)} ₺
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(product.id)}
        className="
          w-8 h-8 rounded-lg bg-red-100 text-red-600
          hover:bg-red-200 transition-colors
          flex items-center justify-center
          font-bold
        "
        title="Sepetten Çıkar"
      >
        ✕
      </button>
    </div>
  );
}

