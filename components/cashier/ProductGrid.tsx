// components/cashier/ProductGrid.tsx

'use client';

import { ProductCategory, Product } from '@/lib/types';
import { getProductsByCategory } from '@/lib/cashier-data';
import ProductCard from './ProductCard';

interface ProductGridProps {
  category: ProductCategory;
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({ category, onProductClick }: ProductGridProps) {
  const products = getProductsByCategory(category);

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-xl font-medium">Bu kategoride ürün yok</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onClick={() => onProductClick(product)}
        />
      ))}
    </div>
  );
}

