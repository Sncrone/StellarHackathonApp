// lib/types.ts

export type ProductCategory = 'beverages' | 'food' | 'merch';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;              // TL cinsinden
  image?: string;             // Opsiyonel görsel URL
  emoji: string;              // Emoji ikonu
  cashbackRate: number;       // 0.05 = %5 token cashback (UNIP için %5)
  stock?: number;             // Stok miktarı (opsiyonel)
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
  totalTokens: number;        // Kazanılacak token
}

// Öğrenci arayüzü için types
export type RewardCategory = 'discount' | 'free_item' | 'merch';
export type TransactionType = 'earn' | 'spend';

export interface Reward {
  id: string;
  name: string;
  description: string;
  category: RewardCategory;
  cost: number;              // UniP cinsinden
  emoji: string;
  value: string;             // "%10", "1 adet"
  available: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: Date;
  relatedItem?: string;
}

export interface StudentBalance {
  current: number;           // Mevcut UniP
  earnedThisMonth: number;   // Bu ay kazanılan
  spentThisMonth: number;    // Bu ay harcanan
}

