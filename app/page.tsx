// app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import QRWalletCard from '@/components/student/QRWalletCard';
import BalanceCard from '@/components/student/BalanceCard';
import TabNavigation from '@/components/student/TabNavigation';
import RewardsTab from '@/components/student/RewardsTab';
import HistoryTab from '@/components/student/HistoryTab';
import { getRewardBalance } from '@/lib/loyalty-reader';
import { StudentBalance } from '@/lib/types';

type TabType = 'rewards' | 'history';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('rewards');
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState<StudentBalance>({
    current: 0,
    earnedThisMonth: 0,
    spentThisMonth: 0
  });
  const [loading, setLoading] = useState(false);

  // Cüzdan bağlandığında
  const handleConnect = (key: string) => {
    setPublicKey(key);
  };

  // Cüzdan bağlantısı koptuğunda
  const handleDisconnect = () => {
    setPublicKey('');
    setBalance({
      current: 0,
      earnedThisMonth: 0,
      spentThisMonth: 0
    });
  };

  // Bakiye güncelleme
  useEffect(() => {
    if (publicKey) {
      setLoading(true);
      
      const fetchBalance = async () => {
        try {
          const currentBalance = parseFloat(await getRewardBalance(publicKey));
          setBalance({
            current: currentBalance,
            earnedThisMonth: 0,
            spentThisMonth: 0
          });
        } catch (error) {
          console.error('Bakiye okuma hatası:', error);
          setBalance({
            current: 0,
            earnedThisMonth: 0,
            spentThisMonth: 0
          });
        } finally {
          setLoading(false);
        }
      };

      fetchBalance();

      // Her 5 saniyede bir güncelle
      const interval = setInterval(fetchBalance, 5000);
      return () => clearInterval(interval);
    }
  }, [publicKey]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <QRWalletCard 
            publicKey={publicKey}
            balance={balance.current}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Balance Card */}
        {publicKey && (
          <BalanceCard balance={balance} />
        )}

        {/* Tab Navigation - SADECE 2 SEKME */}
        {publicKey && (
          <>
            <TabNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div>
              {activeTab === 'rewards' && (
                <RewardsTab 
                  currentBalance={balance.current}
                  publicKey={publicKey}
                  onRedeemSuccess={() => {
                    // Bakiye güncellemesini tetikle
                    const fetchBalance = async () => {
                      try {
                        const currentBalance = parseFloat(await getRewardBalance(publicKey));
                        setBalance({
                          current: currentBalance,
                          earnedThisMonth: 0,
                          spentThisMonth: 0
                        });
                      } catch (error) {
                        console.error('Bakiye okuma hatası:', error);
                      }
                    };
                    fetchBalance();
                  }}
                />
              )}
              {activeTab === 'history' && (
                <HistoryTab />
              )}
            </div>
          </>
        )}

        {/* Cüzdan bağlı değilse mesaj */}
        {!publicKey && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">Lütfen cüzdanınızı bağlayın</p>
            <p className="text-sm mt-2">Ödülleri ve işlem geçmişinizi görmek için cüzdanınızı bağlamanız gerekiyor</p>
          </div>
        )}
      </div>
    </div>
  );
}
