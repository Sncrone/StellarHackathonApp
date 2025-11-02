// components/student/QRWalletCard.tsx

'use client';

import QRCode from 'react-qr-code';
import WalletConnection from '@/components/WalletConnection';

interface QRWalletCardProps {
  publicKey?: string;
  balance: number;
  onConnect: (key: string) => void;
  onDisconnect: () => void;
}

export default function QRWalletCard({ 
  publicKey, 
  balance, 
  onConnect, 
  onDisconnect 
}: QRWalletCardProps) {
  if (!publicKey) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6 shadow-lg">
        <WalletConnection 
          onConnect={onConnect}
          onDisconnect={onDisconnect}
        />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-lg text-white relative">
      {/* Header Image - Digital Wallet/QR Code */}
      <div className="absolute top-0 left-0 right-0 h-full">
        <div className="relative h-full w-full">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=300&fit=crop&q=80" 
            alt="Digital wallet with QR code" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/85 to-purple-600/85"></div>
        </div>
      </div>
      
      <div className="relative p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-blue-100 mb-2">Cüzdan Adresi</p>
            <p className="font-mono text-xs break-all mb-4">{publicKey}</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-blue-100">Mevcut UniP</p>
                <p className="text-3xl font-bold">{balance.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <QRCode value={publicKey} size={120} />
          </div>
        </div>
      </div>
    </div>
  );
}

