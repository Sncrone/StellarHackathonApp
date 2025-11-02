// components/student/RewardCard.tsx

'use client';

import { useState } from 'react';
import { Reward } from '@/lib/types';
import { stellar } from '@/lib/stellar-helper';

interface RewardCardProps {
  reward: Reward;
  currentBalance: number;
  publicKey?: string;
  onRedeemSuccess?: () => void;
}

export default function RewardCard({ reward, currentBalance, publicKey, onRedeemSuccess }: RewardCardProps) {
  const canAfford = currentBalance >= reward.cost;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRedeem = async () => {
    if (!publicKey || !canAfford) return;

    if (!confirm(`${reward.name} ödülünü ${reward.cost} UniP karşılığında kullanmak istediğinizden emin misiniz?`)) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Öğrencinin bakiyesini kontrol et (client-side check)
      if (currentBalance < reward.cost) {
        setMessage('Yetersiz UniP bakiyesi!');
        setLoading(false);
        return;
      }

      const ADMIN_PUBLIC_KEY = 'GC3V323N27R3K5NLILSMBHVZX44VJFTNZLFQG6CWFR5NVFAJHTPJM5OH';

      // Stellar Helper ile asset payment gönder
      const result = await stellar.sendAssetPayment({
        from: publicKey,
        to: ADMIN_PUBLIC_KEY,
        assetCode: 'UNIP',
        assetIssuer: 'GDF7RQ6OH5XMCP7RANG7XLWWXBMZ3RMKSGI66M7K2ZAGMI6VZW7YELI4',
        amount: reward.cost.toString(),
      });

      if (result.success) {
        setMessage(`✅ ${reward.name} başarıyla kullanıldı!`);
        // Bakiye güncellemesi için parent component'e haber ver
        if (onRedeemSuccess) {
          setTimeout(() => {
            onRedeemSuccess();
          }, 1000);
        }
      } else {
        setMessage('İşlem başarısız oldu.');
      }
    } catch (error: any) {
      console.error('Ödül kullanma hatası:', error);
      setMessage(`Hata: ${error.message || 'Bir hata oluştu'}`);
    } finally {
      setLoading(false);
    }
  };

  // Kart kategorisine göre Unsplash resimleri - İsimlere göre anlamlı resimler
  const getImageUrl = (category: string, name: string) => {
    // Kupon/İndirim kategorisi için bilet görselleri
    if (category === 'discount') {
      return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=300&fit=crop&q=80'; // Ticket/Coupon
    }
    
    // Ücretsiz ürün kategorisi için kahve, sandviç ve sinema bileti görselleri
    if (category === 'free_item') {
      if (name.includes('Sinema') || name.includes('sinema') || name.includes('Bileti') || name.includes('bileti')) {
        return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=300&fit=crop&q=80'; // Cinema ticket
      }
      if (name.includes('Kahve') || name.includes('kahve')) {
        return 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=300&fit=crop&q=80'; // Coffee cup
      }
      if (name.includes('Sandviç') || name.includes('sandviç')) {
        return 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=600&h=300&fit=crop&q=80'; // Sandwich
      }
      return 'https://images.unsplash.com/photo-1504674900247-0877df9c8368?w=600&h=300&fit=crop&q=80'; // Food default
    }
    
    // Merch kategorisi için üniversite ürünleri
    if (category === 'merch') {
      if (name.includes('T-shirt') || name.includes('tişört')) {
        return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=300&fit=crop&q=80'; // T-shirt
      }
      if (name.includes('Kupa') || name.includes('kupa')) {
        return 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=300&fit=crop&q=80'; // Mug
      }
      return 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=300&fit=crop&q=80'; // Merch default
    }
    
    return 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=300&fit=crop&q=80'; // Default
  };

  return (
    <div className={`
      bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 relative
      ${canAfford 
        ? 'border-green-500 shadow-lg hover:shadow-xl hover:scale-105' 
        : 'border-gray-200 opacity-60'
      }
    `}>
      {/* Header Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="relative h-full w-full">
          <img 
            src={getImageUrl(reward.category, reward.name)} 
            alt={reward.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
        </div>
        {/* Name overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-xl text-white drop-shadow-lg">
            {reward.name}
          </h3>
        </div>
      </div>

      <div className="p-6 pt-4">
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 text-center">
          {reward.description}
        </p>

        {/* Value Badge */}
        <div className="flex justify-center mb-4">
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
            Değer: {reward.value}
          </span>
        </div>

        {/* Cost */}
        <div className="text-center mb-4">
          <p className="text-3xl font-bold text-purple-600">
            {reward.cost} UniP
          </p>
          {!canAfford && (
            <p className="text-xs text-red-600 font-medium mt-1">
              {(reward.cost - currentBalance).toFixed(2)} UniP eksik
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm text-center ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleRedeem}
          disabled={!canAfford || loading || !publicKey}
          className={`
            w-full py-3 rounded-xl font-bold text-lg transition-all
            ${canAfford && publicKey && !loading
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {loading 
            ? '⏳ İşleniyor...' 
            : !publicKey 
            ? '🔒 Cüzdan Bağlanmalı'
            : canAfford 
            ? '✅ Kullan' 
            : '🔒 Yetersiz UniP'
          }
        </button>
      </div>
    </div>
  );
}

