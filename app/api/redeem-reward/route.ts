// app/api/redeem-reward/route.ts

// Ödül kullanma (UniP harcama) API endpoint'i

import { NextResponse } from 'next/server';
import { Keypair, Horizon, TransactionBuilder, Asset, Operation } from 'stellar-sdk';

// Yönetici cüzdanı bilgileri
const ADMIN_PUBLIC_KEY = 'GC3V323N27R3K5NLILSMBHVZX44VJFTNZLFQG6CWFR5NVFAJHTPJM5OH';

// UNIP token tanımı
const REWARD_TOKEN = new Asset('UNIP', 'GDF7RQ6OH5XMCP7RANG7XLWWXBMZ3RMKSGI66M7K2ZAGMI6VZW7YELI4');

// Stellar Testnet sunucusuna bağlan
const server = new Horizon.Server('https://horizon-testnet.stellar.org');

/**
 * Ödül kullanma endpoint'i
 * Öğrenci cüzdanından yönetici cüzdanına UniP gönderir
 */
export async function POST(request: Request) {
  try {
    const { student_address, reward_cost, reward_id, reward_name } = await request.json();

    // Validasyon
    if (!student_address || !reward_cost || !reward_id) {
      return NextResponse.json(
        { error: 'Öğrenci adresi, ödül maliyeti ve ödül ID gereklidir' },
        { status: 400 }
      );
    }

    // Öğrenci hesabını yükle
    const studentAccount = await server.loadAccount(student_address);

    // Öğrencinin UniP bakiyesini kontrol et
    const unipBalance = studentAccount.balances.find(
      (balance: any) =>
        balance.asset_type !== 'native' &&
        balance.asset_code === 'UNIP' &&
        balance.asset_issuer === 'GDF7RQ6OH5XMCP7RANG7XLWWXBMZ3RMKSGI66M7K2ZAGMI6VZW7YELI4'
    );

    if (!unipBalance || parseFloat(unipBalance.balance) < reward_cost) {
      return NextResponse.json(
        { error: 'Yetersiz UniP bakiyesi' },
        { status: 400 }
      );
    }

    // Payment işlemini oluştur
    const transaction = new TransactionBuilder(studentAccount, {
      fee: '100',
      networkPassphrase: 'Test SDF Network ; September 2015',
    })
      .addOperation(
        Operation.payment({
          destination: ADMIN_PUBLIC_KEY,
          asset: REWARD_TOKEN,
          amount: reward_cost.toString(),
        })
      )
      .setTimeout(30)
      .build();

    // İşlemi öğrencinin imzalaması gerekiyor - bu kısım client-side'da yapılacak
    // Bu API endpoint sadece işlem hazırlığını yapar, imzalama client'ta olur

    // Transaction XDR'ını döndür (client'ta imzalanacak)
    return NextResponse.json({
      success: true,
      transactionXdr: transaction.toXDR(),
      message: `${reward_name} ödülü için ${reward_cost} UniP kullanılacak`,
    });

  } catch (error: any) {
    console.error('Ödül kullanma hatası:', error);
    
    let errorMessage = error.message;
    if (error.response?.data?.extras) {
      errorMessage = error.response.data.extras.result_codes?.operations?.[0] || error.message;
    }

    return NextResponse.json(
      { error: 'İşlem başarısız', details: errorMessage },
      { status: 500 }
    );
  }
}

