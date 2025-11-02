// app/api/send-reward/route.ts

// Bu, bizim "Anchor" (Lenger) simülasyonumuzun "ödül verme" beynidir.



import { NextResponse } from 'next/server';

// Gerekli Stellar kütüphanelerini import ediyoruz

import { Keypair, Horizon, TransactionBuilder, Asset, Operation } from 'stellar-sdk';



// ==============================================================================

//           !!!!! HACKATHON İÇİN EN ÖNEMLİ KISIM !!!!!

// FAZ 0'da oluşturduğun "Yönetici Cüzdanı" bilgilerini buraya yapıştır:



// "Yönetici Cüzdanı"nın GİZLİ anahtarı (S... ile başlar)

const ADMIN_SECRET_KEY = 'SBGB3N2RZ5CWJRT4HSLBKVS5243LX4ZXJREWZRLO7J46LRH557NGJP3C';



// "Yönetici Cüzdanı"nın GENEL adresi (G... ile başlar)

// Bu adres, yönetici cüzdanı adresidir.

const ADMIN_PUBLIC_KEY = 'GC3V323N27R3K5NLILSMBHVZX44VJFTNZLFQG6CWFR5NVFAJHTPJM5OH';



// ==============================================================================





// Hangi token'ı göndereceğimizi tanımlıyoruz:

const REWARD_TOKEN = new Asset('UNIP', 'GDF7RQ6OH5XMCP7RANG7XLWWXBMZ3RMKSGI66M7K2ZAGMI6VZW7YELI4');



// Stellar Testnet sunucusuna bağlanıyoruz

const server = new Horizon.Server('https://horizon-testnet.stellar.org');



/**

 * Bu fonksiyon, "Kasiyer Arayüzü"nden gelen POST isteklerini karşılar.

 */

export async function POST(request: Request) {

  try {

    // 1. Kasiyerden gelen isteğin içindeki JSON verisini oku:

    // (Öğrencinin adresi ve ne kadarlık TL harcaması yaptığı)

    const { student_address, tl_amount } = await request.json();



    // 2. Gerekli veriler gelmiş mi diye kontrol et:

    if (!student_address || !tl_amount) {

      return NextResponse.json({ error: 'Öğrenci adresi ve TL tutarı gerekli' }, { status: 400 });

    }



    // 3. Yönetici cüzdanının gizli anahtarını yükle (imza için):

    const adminKeypair = Keypair.fromSecret(ADMIN_SECRET_KEY);



    // 4. Yönetici hesabının güncel durumunu Stellar'dan çek (sequence number için):

    const sourceAccount = await server.loadAccount(adminKeypair.publicKey());



    // 5. Ödülü Hesapla (Bizim "Off-Chain" İş Mantığımız):

    // Kural: Harcanan her 10 TL için 1 UNIP ver.

    const rewardAmount = (parseFloat(tl_amount) * 0.05).toString();



    // 6. Stellar İşlemini (Transaction) Oluştur:

    const transaction = new TransactionBuilder(sourceAccount, {

      fee: '100', // Standart işlem ücreti (stroops)

      networkPassphrase: 'Test SDF Network ; September 2015', // Testnet şifresi

    })

      // NOT: Bu işlemin çalışması için "student_address"in

      // bizim REWARD_TOKEN'ımıza "Trustline" (Güven Hattı) oluşturmuş olması gerekir.

      // Öğrenci arayüzünde "Sisteme Kayıt Ol" butonu ile bunu yaptıracağız.

      .addOperation(

        Operation.payment({

          destination: student_address, // Ödülü alacak öğrenci

          asset: REWARD_TOKEN,          // Hangi token: UNIP

          amount: rewardAmount,         // Hesaplanan miktar

        })

      )

      .setTimeout(30) // 30 saniye zaman aşımı

      .build();



    // 7. İşlemi YÖNETİCİ olarak (gizli anahtarla) imzala:

    transaction.sign(adminKeypair); 



    // 8. İmzalı işlemi Stellar ağına gönder:

    const result = await server.submitTransaction(transaction);

    

    // 9. Kasiyere başarı mesajı dön:

    return NextResponse.json({ 

      success: true, 

      message: `${rewardAmount} UNIP, ${student_address.substring(0, 6)}... adresine gönderildi.`, 

      hash: result.hash 

    });



  } catch (error: any) {

    // 10. Bir hata olursa yakala ve Kasiyere detaylı bilgi ver:

    console.error(error); // Hata olursa sunucu konsoluna (terminale) yazdır

    

    // Hata ayıklama için Stellar'dan gelen spesifik hatayı bul

    let errorMessage = error.message;

    if (error.response && error.response.data && error.response.data.extras) {

      errorMessage = error.response.data.extras.result_codes.operations[0] || error.message;

      

      // En yaygın hata: Öğrenci Trustline oluşturmamışsa

      if (errorMessage === 'op_no_trust') {

        errorMessage = 'İşlem Başarısız: Öğrenci bu tokena (UNIP) henüz güven hattı (Trustline) açmamış.';

      }

    }

    

    return NextResponse.json({ error: 'İşlem başarısız', details: errorMessage }, { status: 500 });

  }

}

