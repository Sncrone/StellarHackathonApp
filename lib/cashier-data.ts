// lib/cashier-data.ts

import { Product, ProductCategory } from './types';

export const PRODUCTS: Product[] = [
  // İÇECEKLER
  {
    id: 'bev-1',
    name: 'Türk Kahvesi',
    category: 'beverages',
    price: 25,
    emoji: '☕',
    cashbackRate: 0.05, // %5 UNIP
    stock: 50
  },
  {
    id: 'bev-2',
    name: 'Çay',
    category: 'beverages',
    price: 15,
    emoji: '🍵',
    cashbackRate: 0.05,
    stock: 100
  },
  {
    id: 'bev-3',
    name: 'Cappuccino',
    category: 'beverages',
    price: 30,
    emoji: '☕',
    cashbackRate: 0.05,
    stock: 30
  },
  {
    id: 'bev-4',
    name: 'Latte',
    category: 'beverages',
    price: 35,
    emoji: '☕',
    cashbackRate: 0.05,
    stock: 25
  },
  {
    id: 'bev-5',
    name: 'Meyve Suyu',
    category: 'beverages',
    price: 20,
    emoji: '🧃',
    cashbackRate: 0.05,
    stock: 40
  },
  // YİYECEKLER
  {
    id: 'food-1',
    name: 'Sandviç',
    category: 'food',
    price: 40,
    emoji: '🥪',
    cashbackRate: 0.05,
    stock: 30
  },
  {
    id: 'food-2',
    name: 'Tost',
    category: 'food',
    price: 35,
    emoji: '🍞',
    cashbackRate: 0.05,
    stock: 50
  },
  {
    id: 'food-3',
    name: 'Salata',
    category: 'food',
    price: 45,
    emoji: '🥗',
    cashbackRate: 0.05,
    stock: 20
  },
  {
    id: 'food-4',
    name: 'Börek',
    category: 'food',
    price: 30,
    emoji: '🥐',
    cashbackRate: 0.05,
    stock: 40
  },
  {
    id: 'food-5',
    name: 'Pizza Dilim',
    category: 'food',
    price: 50,
    emoji: '🍕',
    cashbackRate: 0.05,
    stock: 25
  },
  {
    id: 'food-6',
    name: 'Pasta',
    category: 'food',
    price: 35,
    emoji: '🍰',
    cashbackRate: 0.05,
    stock: 20
  },
  // MERCH
  {
    id: 'merch-1',
    name: 'Üniversite T-shirt',
    category: 'merch',
    price: 150,
    emoji: '👕',
    cashbackRate: 0.05,
    stock: 50
  },
  {
    id: 'merch-2',
    name: 'Hoodie',
    category: 'merch',
    price: 250,
    emoji: '🧥',
    cashbackRate: 0.05,
    stock: 30
  },
  {
    id: 'merch-3',
    name: 'Şapka',
    category: 'merch',
    price: 80,
    emoji: '🧢',
    cashbackRate: 0.05,
    stock: 40
  },
  {
    id: 'merch-4',
    name: 'Çanta',
    category: 'merch',
    price: 120,
    emoji: '🎒',
    cashbackRate: 0.05,
    stock: 25
  }
];

// Kategoriye göre ürünleri filtrele
export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter(p => p.category === category);
}

