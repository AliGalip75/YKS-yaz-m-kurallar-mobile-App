# Agent Core Rules

1. **Language & Comments:** Tüm kod içi yorum satırları (comments) DAİMA ve SADECE İngilizce yazılacaktır.
2. **Communication:** Laf kalabalığı yapmak yasaktır. Sadece sorulan soruya net cevap verilecek ve doğrudan istenen kod üretilecektir. Gereksiz uzun açıklamalardan kaçınılacaktır.
3. **Completeness:** Kodlar "buraya senin kodun gelecek" (placeholder) şeklinde eksik bırakılmayacak, doğrudan çalışacak şekilde tam verilecektir.
4. **Dependencies:** Kullanıcı açıkça talep etmedikçe yeni paket/kütüphane eklenmeyecektir. Mevcut "Tech Stack" sınırları içinde kalınacaktır.
5. **Modification:** Mevcut kod güncellenirken, sistemin geri kalanını (import'lar, tipler, mimari) bozmamaya azami özen gösterilecektir. Bileşenleri (components) olabildiğince küçük ve tekrar kullanılabilir (reusable) tasarla.
6. **Safety & Stability:** Try-catch blokları ve temel hata yönetimi (error handling) atlanmayacaktır.
7. **Performance:** Gereksiz render işlemlerinden kaçın; useMemo ve useCallback hook'larını stratejik olarak kullan.
8. **development environment:** Expo Go modülleri önerme. Cihaza özgü kütüphaneler eklenirken her zaman npx expo run:android ile dev client üzerinden test edileceğini varsayarak kod üret.

9. **Build & Test:** Expo Go kullanılmaz. Geliştirme sırasında
   `npx expo run:android` ile dev client üzerinden fiziksel cihazda
   test edilir. Production build için EAS CLI kullanılır (`eas build`).
   `npm run web` önermek yasaktır.

**CRITICAL THEME RULE:** Stop using dark: modifiers (like dark:bg-slate-900 or dark:text-white) in your components. The entire point of our global.css architecture is semantic variables. Components should be completely blind to the current theme. Only use semantic classes like bg-surface, text-text, border-border, and text-primary. The global.css will automatically handle the color swap. Refactor the code to strictly follow this rule.
