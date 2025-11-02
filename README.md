# Stellar Kampüs Sadakat Programı UNIP  (Stellar Campus Loyalty UNIP)

Bu proje, gerçek dünyadaki (off-chain) TL harcamalarını, Stellar ağı üzerinde (on-chain) kanıtlanabilir dijital ödüllere dönüştüren bir **"Anchor" (Lenger)** simülasyonudur.

Bu hackathon projesi, "İnsanları XLM kullanmaya zorlamadan Stellar'ın gücünden nasıl faydalanabiliriz?" sorusuna bir cevap olarak geliştirilmiştir.

![Stellar](https://img.shields.io/badge/Stellar-Blockchain-000000?style=for-the-badge&logo=stellar)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwindcss)



## 1. Sorun: "Gerçek Dünya" ve "Blockchain" Arasındaki Köprü

Blockchain tabanlı sadakat programlarının önündeki en büyük engel "toplu kabul" (mass adoption) sorunudur:

1.  **Kullanıcı Engeli:** Öğrenciler, kantin ödemelerini kripto para (XLM) ile yapmak istemez. Alışık oldukları TL ve kredi kartını (off-chain) kullanmaya devam etmek isterler.
2.  **Güven Engeli:** Geleneksel sadakat puanları, şirketin merkezi bir veritabanında tutulan "dijital sayılardır". Kullanıcı bu puanlara *gerçekten* sahip değildir ve puanlar şeffaf değildir.
3.  **Entegrasyon Engeli:** Gerçek dünyadaki (off-chain) bir TL harcaması, blockchain'e (on-chain) nasıl bildirilecek?

## 2. Çözüm: "Anchor" (Lenger) Simülasyonu

Projemiz, bu köprüyü kurmak için Stellar'ın temel mimarisi olan **"Anchor" (Lenger)** sistemini simüle eder.

Bu mimaride, **Üniversite (Yönetim)** güvenilir bir "Anchor" rolü üstlenir:

1.  Öğrenci, 100 TL'lik harcamasını **kredi kartıyla (off-chain)** yapar.
2.  "Kasiyer Arayüzümüz" (`/kasiyer`), bu off-chain harcamayı doğrulayan **"Oracle" (Kahin)** görevi görür.
3.  "Kasiyer", öğrencinin cüzdan adresini ve 100 TL'lik harcamayı API'mize bildirir.
4.  API'miz (Anchor'ın beyni), bu 100 TL'nin karşılığı olarak öğrenciye **5 `PUAN`** (bizim yarattığımız Stellar varlığı) gönderir.

Sonuç? Öğrenci alışkanlıklarını değiştirmez (TL ile öder) ama ödülünü *şeffaf, kanıtlanabilir ve gerçekten sahip olduğu* bir dijital varlık (on-chain `PUAN` token'ı) olarak alır.

## 3. Proje Mimarisi: Yetki Ayrımı Modeli

Projemiz, Stellar'ın kurumsal yeteneklerini kullanarak 3 farklı hesaba dayanır:

1.  **"Dekan" (Yaratıcı / Issuer):**
    * **Görevi:** `PUAN` token'ını yaratır. Token'ın "Yaratıcısı" odur.
    * **Süper Gücü:** Gelecekteki geliştirmeler için `Clawback` (Geri Çekme / Ceza) yetkisine sahip tek hesaptır. Bu, dekanın tam yetkili olmasını sağlar.

2.  **"İşletmeci" (Dağıtıcı / Operator):**
    * **Görevi:** Token stoğunu (örn: 1 Milyon `PUAN`) tutar.
    * **Süper Gücü:** `app/api/send-reward` API'miz, bu hesabın `Secret Key`'ini kullanarak öğrencilere günlük ödül dağıtımını yapar. Bu, "Dekan"ın gizli anahtarını riske atmadan operasyonları yürütmemizi sağlar.

3.  **"Öğrenci" (Kullanıcı / Alıcı):**
    * **Görevi:** `PUAN` token'ına `Trustline` (Güven Hattı) açar, puanları alır ve biriktirir.

### Akış Şeması (Off-Chain -> On-Chain)## 
4. Ana Özellikler

* **Canlı Öğrenci Dashboard (`/`):**
    * `@creit.tech/stellar-wallets-kit` kullanarak `Freighter` ile cüzdan bağlantısı.
    * `lib/loyalty-reader.ts` motoru, öğrencinin `PUAN` bakiyesini her 5 saniyede bir **canlı** olarak Stellar Testnet'ten okur.
    * `react-qr-code` ile öğrencinin cüzdan adresini Kasiyer'e göstermesi için QR kod oluşturur.
    * Gelen puana göre "Ayrıcalık Kartları"nın kilidi (🔒 -> 🔓) otomatik olarak açılır.

* **Kasiyer Arayüzü / Anchor Simülasyonu (`/kasiyer`):**
    * Kasiyerin, öğrenci adresini ve (off-chain) TL harcamasını girdiği yönetici paneli.
    * "Ödül Gönder" butonu, `app/api/send-reward` API'sini tetikler.

* **Güvenli Arka Plan API'si (`/api/send-reward`):**
    * "İşletmeci" cüzdanının `Secret Key`'ini kullanarak işlemi sunucu tarafında imzalar.
    * Harcamanın %5'i kadar `PUAN`'ı "İşletmeci" stoğundan öğrenciye gönderir.

## 5. Kullanılan Teknolojiler

* **Frontend:** Next.js, React 18, TypeScript
* **Styling:** Tailwind CSS
* **Blockchain (Stellar):**
    * `stellar-sdk`: API'de (backend) işlem oluşturmak ve imzalamak için.
    * `@creit.tech/stellar-wallets-kit`: Öğrenci arayüzünde (frontend) cüzdan bağlamak için.
* **UI Bileşenleri:** `react-qr-code`
* **Altyapı:** Stellar Testnet

## 6. Yerel Kurulum (Nasıl Çalıştırılır)

Bu projeyi çalıştırmak için hem Stellar üzerinde manuel adımlar hem de kod kurulumu gereklidir.

### Adım 1: (Zorunlu) Stellar Cüzdan Hazırlığı

Projenin 3 adet cüzdana ihtiyacı vardır. [Stellar Laboratory (Testnet)](https://laboratory.stellar.org/#account-creator?network=test) kullanarak 3 adet yeni cüzdan yaratın ve hepsini "Fund" (Fonla) butonuna basarak Testnet'te aktifleştirin:

1.  **"Dekan (Yaratıcı)"** (Public ve Secret Key'i kaydedin).
2.  **"İşletmeci (Dağıtıcı)"** (Public ve Secret Key'i kaydedin).
3.  **"Test Öğrenci"** (Public ve Secret Key'i kaydedin).

### Adım 2: (Zorunlu) Token Yaratma ve Stok Transferi

1.  [Stellar Laboratory (Transaction Builder)](https://laboratory.stellar.org/#txbuilder?network=test)'i açın.
2.  **"İşletmeci"** adına, **"Dekan"**ın `PUAN` token'ı için bir `Change Trust` (Güven Hattı) operasyonu oluşturun.
3.  **"Dekan"** adına, **"İşletmeci"**ye 1 Milyon `PUAN` `Payment` (Ödeme) operasyonu oluşturun.
4.  Bu iki operasyonu **tek bir işlemde** birleştirin.
5.  İşlemi hem **"İşletmeci"**nin hem de **"Dekan"**ın `Secret Key`'leri ile imzalayın ve "Submit" (Gönder) edin.
    *(Bu, `FAZ 1`'deki "Çoklu-İmza" adımımızdır.)*

### Adım 3: (Zorunlu) Öğrenci Trustline

1.  "Test Öğrenci" cüzdanını kullanarak, "Dekan"ın `PUAN` token'ına `Change Trust` (Güven Hattı) işlemi oluşturun ve gönderin. (Bunu `Freighter`'ın "Add Asset" menüsünden de yapabilirsiniz).

### Adım 4: Proje Kurulumu

1.  Projeyi klonlayın:
    ```bash
    git clone [SENIN-GITHUB-LINKIN]
    cd Kampus-Projesi
    ```

2.  Gerekli paketleri kurun:
    ```bash
    npm install
    npm install stellar-sdk @creit.tech/stellar-wallets-kit react-qr-code
    ```

3.  **Kodu Güncelleyin (En Önemli Adım):**
    * `app/api/send-reward/route.ts` dosyasını açın:
        * `ADMIN_SECRET_KEY` değişkenine **"İŞLETMECİ"**nin `S...` anahtarını yapıştırın.
        * `ADMIN_PUBLIC_KEY` değişkenine **"İŞLETMECİ"**nin `G...` adresini yapıştırın.
        * `REWARD_TOKEN` satırındaki `Asset`'in `Issuer` (Yaratıcı) kısmına **"DEKAN"**ın `G...` adresini yapıştırın.
    * `lib/loyalty-reader.ts` dosyasını açın:
        * `REWARD_ISSUER` değişkenine **"DEKAN"**ın `G...` adresini yapıştırın.

4.  Sunucuyu başlatın:
    ```bash
    npm run dev
    ```

5.  Demo yapmaya hazırsınız:
    * **Öğrenci Arayüzü:** `http://localhost:3000`
    * **Kasiyer Arayüzü:** `http://localhost:3000/kasiyer`

## 7. Gelecek Planları ve Geliştirmeler

* **Clawback (Ceza) Entegrasyonu:** "Dekan" cüzdanının `Clawback` (Geri Çekme) yetkisini kullanarak, kütüphaneye kitap geç getirme gibi olumsuz davranışlar için puan silme API'si (`/api/clawback-fine`) eklenebilir.
* **Otomatik Trustline:** Öğrenci arayüzüne, `PUAN` token'ı için otomatik `Change Trust` (Güven Hattı) oluşturan bir "Sisteme Kayıt Ol" butonu eklenebilir.
* **Gerçek POS Entegrasyonu:** `app/kasiyer` arayüzü, manuel bir form yerine, gerçek bir POS cihazından (örn: Verifone, Ingeni
