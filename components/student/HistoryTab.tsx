// components/student/HistoryTab.tsx

'use client';

import { useState } from 'react';
import { TRANSACTIONS } from '@/lib/student-data';
import { TransactionType } from '@/lib/types';
import TransactionItem from './TransactionItem';

export default function HistoryTab() {
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');

  const filteredTransactions = filter === 'all'
    ? TRANSACTIONS
    : TRANSACTIONS.filter(t => t.type === filter);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          📋 Tümü
        </button>
        <button
          onClick={() => setFilter('earn')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'earn'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          ⬆️ Kazançlar
        </button>
        <button
          onClick={() => setFilter('spend')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'spend'
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          ⬇️ Harcamalar
        </button>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-6xl mb-4">📭</p>
            <p className="text-xl">Henüz işlem yok</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map(tx => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

