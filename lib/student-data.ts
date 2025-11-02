// lib/student-data.ts

import { Reward, Transaction, StudentBalance } from './types';

// SADECE 6 ÖDÜL (Demo için yeterli)
export const REWARDS: Reward[] = [
  {
    id: 'reward-1',
    name: '%10 İndirim Kuponu',
    description: 'Tüm ürünlerde geçerli',
    category: 'discount',
    cost: 50,
    emoji: '🎟️',
    value: '10%',
    available: true
  },
  {
    id: 'reward-2',
    name: 'Ücretsiz Sinema Bileti',
    description: 'Sinemada geçerli bilet',
    category: 'free_item',
    cost: 100,
    emoji: '🎫',
    value: '1 adet',
    available: true
  },
  {
    id: 'reward-3',
    name: 'Ücretsiz Kahve',
    description: 'Herhangi bir kahve ücretsiz',
    category: 'free_item',
    cost: 75,
    emoji: '☕',
    value: '1 adet',
    available: true
  },
  {
    id: 'reward-4',
    name: 'Ücretsiz Sandviç',
    description: 'Kantinden sandviç',
    category: 'free_item',
    cost: 120,
    emoji: '🥪',
    value: '1 adet',
    available: true
  },
  {
    id: 'reward-5',
    name: 'Üniversite T-shirt',
    description: 'Limited edition tişört',
    category: 'merch',
    cost: 150,
    emoji: '👕',
    value: '1 adet',
    available: true
  },
  {
    id: 'reward-6',
    name: 'Üniversite Kupa',
    description: 'Özel tasarım kupa',
    category: 'merch',
    cost: 80,
    emoji: '☕',
    value: '1 adet',
    available: true
  }
];

// MOCK İŞLEMLER
export const TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'earn',
    amount: 2.50,
    description: 'Kahve alışverişi',
    date: new Date('2024-11-01T10:30:00'),
    relatedItem: 'Türk Kahvesi'
  },
  {
    id: 'tx-2',
    type: 'earn',
    amount: 4.00,
    description: 'Sandviç alışverişi',
    date: new Date('2024-11-01T12:15:00'),
    relatedItem: 'Sandviç'
  },
  {
    id: 'tx-3',
    type: 'spend',
    amount: -50.00,
    description: '%10 İndirim Kuponu',
    date: new Date('2024-11-02T14:20:00'),
    relatedItem: 'İndirim Kuponu'
  },
  {
    id: 'tx-4',
    type: 'earn',
    amount: 3.50,
    description: 'Salata alışverişi',
    date: new Date('2024-11-02T13:00:00'),
    relatedItem: 'Salata'
  },
  {
    id: 'tx-5',
    type: 'earn',
    amount: 15.00,
    description: 'T-shirt alışverişi',
    date: new Date('2024-11-03T16:45:00'),
    relatedItem: 'T-shirt'
  }
];

// MOCK BAKİYE (Gerçek bakiye Stellar'dan okunacak)
export const STUDENT_BALANCE: StudentBalance = {
  current: 15.25,
  earnedThisMonth: 8.50,
  spentThisMonth: 3.25
};

