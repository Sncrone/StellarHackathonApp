// components/student/BalanceCard.tsx

'use client';

import { StudentBalance } from '@/lib/types';

interface BalanceCardProps {
  balance: StudentBalance;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-2xl overflow-hidden shadow-2xl text-white relative">
      {/* Header Image - Money/Balance */}
      <div className="absolute top-0 left-0 right-0 h-full">
        <div className="relative h-full w-full">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=400&fit=crop&q=80" 
            alt="Money and balance" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-cyan-500/80"></div>
        </div>
      </div>
      
      <div className="relative p-8">
        <div>
          <p className="text-blue-100 text-sm mb-2">MEVCUT UNIP BAKİYESİ</p>
          <p className="text-6xl font-bold mb-4">{balance.current.toFixed(2)}</p>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <p className="text-blue-100 text-xs mb-1">Bu Ay Kazanılan</p>
              <p className="text-2xl font-bold text-green-300">+{balance.earnedThisMonth.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs mb-1">Bu Ay Harcanan</p>
              <p className="text-2xl font-bold text-red-300">-{balance.spentThisMonth.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

