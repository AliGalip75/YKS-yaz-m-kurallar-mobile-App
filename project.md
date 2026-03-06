# YKS Yazım Kuralları Pratik Uygulaması - AI Agent Dokümantasyonu

## 1. Proje Özeti (Project Overview)

Bu proje, sınav öğrencileri için tasarlanmış, spesifik bir konuya (Yazım Kuralları) odaklanan, Firebase tabanlı ve AdMob (reklam) gelir modelli bir React Native mobil uygulamasıdır.

## 2. UI/UX ve Teknoloji Kararı (Tech Stack & UI Decision)

- **Framework:** React Native (Expo)
- **Backend/BaaS:** Firebase (Firestore)
- **Reklam:** `react-native-google-mobile-ads`. AdMob ID'leri `app.json` içindeki `expo.plugins` konfigürasyonunda tutulacaktır.
- **Stil / CSS Kararı:** Geliştirme hızını artırmak ve uygulamanın performansını korumak için **NativeWind** kullanılacaktır.
- **Global Styling ve Renk Yönetimi:**
  - Kesinlikle inline style (örn. `style={{ color: 'red' }}`) kullanma.
  - Tüm renk paleti, tipografi ve dark/light mode ayarları **`global.css`** dosyası içinde CSS değişkenleri (CSS variables) olarak tanımlanacaktır. renkerin karşısında yorum satırı olarak hangi renklere karılık geldiklerini kesinlikle yaz.
  - **`tailwind.config.js`** dosyası, bu CSS değişkenlerini Tailwind class'larına map edecek şekilde ayarlanacaktır.
  - Bileşenler içinde sadece NativeWind class'ları (örn. `className="bg-primary text-text-light"`) kullanılacaktır. Harici bir `colors.ts` dosyası oluşturma.
  ### Zorunlu Semantic Tailwind Class'ları
  - bg-surface, bg-background, bg-primary, bg-card
  - text-text, text-text-muted, text-primary, text-error
  - border-border
- **Bileşen (Component) Mimarisi:** Projeyi ağırlaştırmamak adına büyük UI kütüphaneleri yerine, doğrudan projeye kopyalanıp özelleştirilebilen **react-native-reusable** bileşenleri tercih edilecektir.
- **Animasyonlar:** Akıcı animasyonlar için `react-native-reanimated` kullanılacaktır.
- **İkonlar:** `lucide-react-native`

## 3. Sayfalar (Screens)

1.  **Home Screen (Dashboard):**
    - Sınava kalan gün sayacı.
    - "Günün Kuralı" veya "Günün Kelimesi" bilgi kartı.
    - Hızlıca teste başlama butonu.
2.  **Quiz Screen:**
    - Üst kısımda ilerleme durumu (Progress Bar).
    - Soru metni ve cevap şıkları.
    - Sorunun altında, yanlış yapılan yazım kuralının neden yanlış olduğunun açıklaması.
    - Sağ üstte soruyu kaydetme butonu.
    - Soruyu kaydetme butonuna tıklandığında, soru kaydedildiğine dair bir bildirim.
3.  **Result Screen:**
    - Doğru/yanlış sayısı ve başarı yüzdesi.
    - Kaydedilen soruları görebileceğimiz sayfaya giden buton.
    - Kaydettiğim soruları görebileceğim ekrana geçmeden önce Geçiş Reklamı gösterilecektir.
4.  **Kaydedilen Soruları Görebileceğim Screen:**
    - Kaydedilen soruların listesi.
    - Kaydedilen soruların detayları.
    - Kaydedilen soruların silme butonu.
5.  **Çıkmış Sorular Screen:**
    - Çıkmış soruların listesi.
    - Çıkmış soruların detayları.
    - Detay sayfasında sorunun kendisi ve sorunun altında sorunun açıklaması.

## 4. Temel Özellikler (Core Features)

- **Soru Çekme ve Önbellekleme:** Soruların Firebase'den çekilmesi ve internet kotası harcamamak için cihazda önbelleklenmesi.
- **AdMob Entegrasyonu:** Ekran altlarında sabit Banner reklam ve test bitimlerinde Interstitial (Geçiş) reklam.
- **Lokal Bildirimler:** Kullanıcıyı her gün aynı saatte test çözmeye davet eden hatırlatıcılar.
- **[Buraya Yeni Özellik Ekle]**
- **[Buraya Yeni Özellik Ekle]**

## 5. Klasör Mimarisi (Folder Structure)

```text
app/                // File-based routing screens
├── (tabs)/         // Tab groups
├── _layout.tsx     // Main layout wrapper
├── index.tsx       // Home screen
├── quiz.tsx        // Quiz screen
src/
├── assets/         // Local images, fonts
├── components/     // Reusable UI components
├── services/       // Firebase config, AdMob setups, API calls
    ├── firebase.ts   // Firestore config + soru çekme
    ├── cache.ts      // AsyncStorage cache yönetimi
    └── admob.ts      // AdMob setup
├── store/          // State management (Zustand)
├── theme/          // Colors, typography, NativeWind custom configurations
└── utils/          // Helper functions, constants
```

## 6. Global State (Zustand)

- `questions[]` — çekilen sorular (cache)
- `savedQuestions[]` — kaydedilen sorular
- `quizSession` — aktif quiz (currentIndex, answers, score)
- `dailyRule` — günün kuralı kartı

## 7. Navigation

- Expo Router (file-based routing) kullanılacaktır. `react-navigation` import etme.

## 8. Firestore Şema

- questions/{id}: { text, options[], correctIndex, explanation, year?, source? }
- dailyContent/{date}: { type: 'rule'|'word', content, title }

## 9. AsyncStorage

- "questions_cache" → Firestore'dan çekilen tüm sorular (JSON)
- "cache_timestamp" → Son çekim tarihi (7 günde bir yenile)
- "saved_questions" → Kullanıcının kaydettiği soru ID'leri[]
- "quiz_stats" → Toplam doğru/yanlış istatistikleri
- "daily_content_cache" → Günün kuralı cache'i

## 10. Akış

Uygulama açılır
└── AsyncStorage'da cache var mı?
├── EVET + 7 günden eski değil → Direkt kullan, Firebase'e gitme
└── HAYIR veya eski → Firebase'den çek, AsyncStorage'a yaz
