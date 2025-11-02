// components/cashier/CategoryTabs.tsx

'use client';

import { ProductCategory } from '@/lib/types';

interface CategoryTabsProps {
  activeCategory: ProductCategory;
  onCategoryChange: (category: ProductCategory) => void;
}

const CATEGORIES = [
  { id: 'beverages' as ProductCategory, label: '☕ İçecekler', color: 'bg-amber-500' },
  { id: 'food' as ProductCategory, label: '🍔 Yiyecekler', color: 'bg-orange-500' },
  { id: 'merch' as ProductCategory, label: '👕 Merch', color: 'bg-purple-500' }
];

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex gap-1 px-4 pt-2">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              px-6 py-3 rounded-t-lg font-medium transition-all
              ${activeCategory === category.id
                ? 'bg-white text-gray-900 border-t border-x border-gray-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}

