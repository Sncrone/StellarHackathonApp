// components/student/RewardsTab.tsx

'use client';

import { useState } from 'react';
import { REWARDS } from '@/lib/student-data';
import { RewardCategory } from '@/lib/types';
import RewardCard from './RewardCard';

interface RewardsTabProps {
  currentBalance: number;
  publicKey?: string;
  onRedeemSuccess?: () => void;
}

export default function RewardsTab({ currentBalance, publicKey, onRedeemSuccess }: RewardsTabProps) {
  const [filter, setFilter] = useState<RewardCategory | 'all'>('all');

  const filteredRewards = filter === 'all' 
    ? REWARDS 
    : REWARDS.filter(r => r.category === filter);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          🎯 Tümü
        </button>
        <button
          onClick={() => setFilter('discount')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'discount'
              ? 'bg-orange-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          🎟️ İndirimler
        </button>
        <button
          onClick={() => setFilter('free_item')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'free_item'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          ☕ Ücretsiz
        </button>
        <button
          onClick={() => setFilter('merch')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'merch'
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          👕 Merch
        </button>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map(reward => (
          <RewardCard 
            key={reward.id}
            reward={reward}
            currentBalance={currentBalance}
            publicKey={publicKey}
            onRedeemSuccess={onRedeemSuccess}
          />
        ))}
      </div>
    </div>
  );
}

