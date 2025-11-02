// app/kasiyer/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { ProductCategory, CartItem, Product } from '@/lib/types';
import CategoryTabs from '@/components/cashier/CategoryTabs';
import ProductGrid from '@/components/cashier/ProductGrid';
import Cart from '@/components/cashier/Cart';

// İşlem geçmişi için tip tanımı
interface TransactionHistory {
  studentAddress: string;
  tlAmount: string;
  unipAmount: string;
  timestamp: string;
  transactionHash?: string;
  cartItems?: { name: string; quantity: number; price: number }[];
}

export default function KasiyerPage() {
  // Tab yönetimi
  const [activeTab, setActiveTab] = useState<'pos' | 'history'>('pos');

  // POS State
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('beverages');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [studentAddress, setStudentAddress] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Geçmiş işlemler
  const [history, setHistory] = useState<TransactionHistory[]>([]);

  // Sayfa yüklendiğinde localStorage'dan geçmişi çek
  useEffect(() => {
    const storedHistory = localStorage.getItem('kasiyer_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Geçmiş yüklenirken hata:', error);
      }
    }
  }, []);

  // Geçmişi localStorage'a kaydet
  const saveToHistory = (transaction: TransactionHistory) => {
    const newHistory = [transaction, ...history];
    setHistory(newHistory);
    localStorage.setItem('kasiyer_history', JSON.stringify(newHistory));
  };

  // Sepete ürün ekle
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  // Sepetten ürün çıkar
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  // Ürün miktarını güncelle
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Sepeti temizle
  const clearCart = () => {
    setCart([]);
  };

  // Toplam tutarı hesapla
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Toplam token'ı hesapla (UNIP)
  const totalTokens = cart.reduce(
    (sum, item) => sum + (item.product.price * item.quantity * item.product.cashbackRate),
    0
  );

  // Ödeme işlemi
  const handleCheckout = () => {
    if (cart.length === 0) {
      setMessage('Sepet boş!');
      return;
    }
    setShowCheckoutModal(true);
  };

  // Ödeme onayı ve API çağrısı
  const handleConfirmPayment = async () => {
    if (!studentAddress) {
      setMessage('Lütfen öğrenci cüzdan adresini girin!');
      return;
    }

    setLoading(true);
    setMessage('Ödül gönderiliyor, lütfen bekleyin...');

    try {
      const res = await fetch('/api/send-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          student_address: studentAddress, 
          tl_amount: totalAmount.toString()
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.details || data.error);
      } else {
        setMessage(`Başarılı: ${data.message}`);
        
        // Geçmişe kaydet
        const cartItems = cart.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        }));

        saveToHistory({
          studentAddress,
          tlAmount: totalAmount.toFixed(2),
          unipAmount: totalTokens.toFixed(2),
          timestamp: new Date().toISOString(),
          transactionHash: data.hash,
          cartItems
        });

        setShowCheckoutModal(false);
        clearCart();
        setStudentAddress('');
      }
    } catch (error: any) {
      setMessage(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Tarihi formatla
  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Adresi kısalt
  const formatAddress = (address: string): string => {
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              🏪 UNIP - Üniversite Puanı
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Kasiyer Sistemi - Ürün seç, sepete ekle, ödeme al
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">Toplam Tutar</p>
              <p className="text-2xl font-bold">{totalAmount.toFixed(2)} ₺</p>
            </div>
            {/* Tab Butonları */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('pos')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'pos'
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-500/50 text-white hover:bg-blue-500/70'
                }`}
              >
                🛒 POS
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-500/50 text-white hover:bg-blue-500/70'
                }`}
              >
                📋 Geçmiş ({history.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POS Sekmesi */}
      {activeTab === 'pos' && (
        <>
          {/* Category Tabs */}
          <CategoryTabs 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Main Content: Products + Cart */}
          <div className="flex gap-4 p-4 h-[calc(100vh-180px)]">
            {/* Left: Product Grid */}
            <div className="flex-1 overflow-auto">
              <ProductGrid 
                category={activeCategory}
                onProductClick={addToCart}
              />
            </div>

            {/* Right: Cart */}
            <div className="w-96 flex-shrink-0">
              <Cart 
                items={cart}
                totalAmount={totalAmount}
                totalTokens={totalTokens}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeFromCart}
                onClearCart={clearCart}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </>
      )}

      {/* Geçmiş İşlemler Sekmesi */}
      {activeTab === 'history' && (
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">İşlem Geçmişi</h2>
            
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-lg">
                <p className="text-6xl mb-4">📭</p>
                <p className="text-xl font-medium">Henüz işlem geçmişi bulunmuyor.</p>
                <p className="text-sm mt-2">İlk ödül gönderdiğinizde burada görünecek.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((transaction, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-blue-500 transition-all shadow-sm"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Öğrenci Adresi</p>
                        <p className="font-mono text-sm break-all text-gray-900">{transaction.studentAddress}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatAddress(transaction.studentAddress)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Harcama Tutarı</p>
                        <p className="text-xl font-bold text-yellow-600">{transaction.tlAmount} TL</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Verilen UNIP</p>
                        <p className="text-xl font-bold text-green-600">{transaction.unipAmount} UNIP</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Tarih</p>
                        <p className="text-sm text-gray-900">{formatDate(transaction.timestamp)}</p>
                        {transaction.transactionHash && (
                          <a
                            href={`https://stellar.expert/explorer/testnet/tx/${transaction.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block underline"
                          >
                            İşlemi Görüntüle →
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Ürün Listesi */}
                    {transaction.cartItems && transaction.cartItems.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Satın Alınan Ürünler:</p>
                        <div className="flex flex-wrap gap-2">
                          {transaction.cartItems.map((item, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {item.name} x{item.quantity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Ödeme Onayı</h2>
            
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Toplam Tutar</p>
                <p className="text-2xl font-bold text-gray-900">{totalAmount.toFixed(2)} ₺</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700 mb-1">Kazanılacak UNIP</p>
                <p className="text-xl font-bold text-green-700">{totalTokens.toFixed(2)} UNIP</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öğrenci Cüzdan Adresi
                </label>
                <input
                  type="text"
                  placeholder="G... ile başlayan adres"
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={studentAddress}
                  onChange={(e) => setStudentAddress(e.target.value)}
                />
              </div>
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg ${
                message.startsWith('Hata') 
                  ? 'bg-red-50 text-red-700' 
                  : 'bg-green-50 text-green-700'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setMessage('');
                }}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={loading || !studentAddress}
                className="flex-1 px-4 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'İşleniyor...' : '✅ Ödemeyi Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
