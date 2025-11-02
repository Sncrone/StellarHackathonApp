// lib/loyalty-reader.ts

// Bu, "Proje 3" (Explorer) mantığını kullanan bakiye okuma motorumuzdur.



import { Horizon } from 'stellar-sdk';



// Stellar Testnet sunucusuna bağlan

const server = new Horizon.Server('https://horizon-testnet.stellar.org');



// !!!!! FAZ 0'DAKİ YÖNETİCİ GENEL ADRESİNİ BURAYA YAPIŞTIR !!!!!

// Bu, "UNIP" token'ının "Issuer" (Yaratıcısı) adresidir. (DEKAN'ın adresi)

const REWARD_ISSUER = 'GDF7RQ6OH5XMCP7RANG7XLWWXBMZ3RMKSGI66M7K2ZAGMI6VZW7YELI4';

// !!!!! FAZ 0'DAKİ YÖNETİCİ GENEL ADRESİNİ BURAYA YAPIŞTIR !!!!!



// Okuyacağımız token'ın adı

const REWARD_TOKEN_CODE = 'UNIP';



/**

 * Herhangi bir Stellar hesabının spesifik "UNIP" bakiyesini getirir.

 * @param accountId Puanı okunacak öğrencinin cüzdan adresi

 */

export const getRewardBalance = async (accountId: string): Promise<string> => {

  try {

    // Hesabın tüm bilgilerini Stellar'dan çek

    const account = await server.accounts().accountId(accountId).call();



    // Hesabın tüm varlıkları (balances) içinde bizim ödül token'ımızı ara

    const rewardBalance = account.balances.find(

      (balance: any) =>

        // 1. Varlık "native" (XLM) olmamalı

        balance.asset_type !== 'native' &&

        // 2. Varlık kodu "UNIP" olmalı

        balance.asset_code === REWARD_TOKEN_CODE &&

        // 3. Varlık yaratıcısı bizim "Yönetici" adresimiz olmalı

        balance.asset_issuer === REWARD_ISSUER

    );



    // Eğer "UNIP" bulunursa bakiyesini, bulunmazsa '0' döndür.

    // toFixed(0) ile "10.0000" gibi ondalıkları kaldırıyoruz.

    return rewardBalance ? parseFloat(rewardBalance.balance).toFixed(0) : '0';

  } catch (error) {

    // Eğer hesap Stellar'da hiç bulunamazsa (veya Trustline yoksa)

    // Horizon '404' hatası verir. Bu normaldir. 0 döndür.

    return '0';

  }

};

