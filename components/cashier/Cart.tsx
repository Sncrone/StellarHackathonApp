// components/cashier/Cart.tsx

'use client';

import { CartItem } from '@/lib/types';
import CartItemComponent from './CartItem';

interface CartProps {
  items: CartItem[];
  totalAmount: number;
  totalTokens: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function Cart({
  items,
  totalAmount,
  totalTokens,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}: CartProps) {
  const isEmpty = items.length === 0;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          🛒 Sepet
        </h2>
        <span className="text-sm text-gray-500">
          {items.length} ürün
        </span>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p className="text-6xl mb-4">🛒</p>
            <p className="text-lg">Sepet boş</p>
            <p className="text-sm">Ürün ekleyin</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <CartItemComponent
                key={item.product.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemoveItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer: Total & Actions */}
      {!isEmpty && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          {/* Token Info */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-700 font-medium">
                💰 Kazanılacak UNIP
              </span>
              <span className="text-green-700 font-bold">
                {totalTokens.toFixed(2)} UNIP
              </span>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Ara Toplam</span>
              <span className="text-gray-900 font-medium">
                {totalAmount.toFixed(2)} ₺
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-xl font-bold text-gray-900">Toplam</span>
              <span className="text-2xl font-bold text-blue-600">
                {totalAmount.toFixed(2)} ₺
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClearCart}
              className="
                flex-1 px-4 py-3 rounded-lg
                bg-red-100 text-red-700 font-medium
                hover:bg-red-200 transition-colors
              "
            >
              🗑️ Temizle
            </button>
            <button
              onClick={onCheckout}
              className="
                flex-[2] px-4 py-3 rounded-lg
                bg-blue-600 text-white font-bold text-lg
                hover:bg-blue-700 transition-colors
                shadow-lg hover:shadow-xl
              "
            >
              ✅ Ödeme Al
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

