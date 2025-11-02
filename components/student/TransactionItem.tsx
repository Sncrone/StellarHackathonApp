// components/student/TransactionItem.tsx

'use client';

import { Transaction } from '@/lib/types';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isEarn = transaction.type === 'earn';
  const date = new Date(transaction.date);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Icon */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-2xl
            ${isEarn 
              ? 'bg-green-100 text-green-600' 
              : 'bg-red-100 text-red-600'
            }
          `}>
            {isEarn ? '⬆️' : '⬇️'}
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {transaction.description}
            </p>
            {transaction.relatedItem && (
              <p className="text-sm text-gray-500">
                {transaction.relatedItem}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {formatDate(date)}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className={`text-right ${isEarn ? 'text-green-600' : 'text-red-600'}`}>
          <p className={`text-xl font-bold ${isEarn ? '' : ''}`}>
            {isEarn ? '+' : ''}{transaction.amount.toFixed(2)} UniP
          </p>
        </div>
      </div>
    </div>
  );
}

