# Kayıp Podo - Dedektif Panosu

> JotForm 2026 Frontend Challenge - İzmir

Podo adındaki maskotumuz kayboldu! Bu uygulama, 5 farklı JotForm formundan toplanan kanıtları analiz ederek Podo'nun izini sürmeye yardımcı olan interaktif bir dedektif panosudur.

## Canlı Demo

🔗 [Demo Linki](#) _(deploy edildikten sonra eklenecek)_

---

## Proje Özeti

Bu proje, JotForm API'sinden gerçek zamanlı veri çekerek kullanıcıların:

- **Arama yapmasını** - Tüm kanıtlarda isim, konum, mesaj içeriği arayabilir
- **Filtrelemesini** - 5 farklı kanıt tipine göre filtreleme yapabilir
- **Kronolojik takip etmesini** - Timeline görünümünde olayları zaman sırasına göre görebilir
- **Haritada izlemesini** - Podo'nun hareketlerini interaktif harita üzerinde takip edebilir

sağlayan modern bir Next.js uygulamasıdır.

---

## Özellikler

### 1. JotForm API Entegrasyonu

5 farklı form tipinden veri çekimi:

| Form Tipi | Açıklama | Örnek Veri |
|-----------|----------|------------|
| **Check-ins** | Konum bazlı giriş kayıtları | İsim, konum, koordinat, not |
| **Messages** | Kişiler arası mesajlaşmalar | Gönderen, alıcı, mesaj içeriği |
| **Sightings** | Görülme raporları | Kim görüldü, kiminle, nerede |
| **Personal Notes** | Kişisel notlar | Yazan kişi, not içeriği |
| **Anonymous Tips** | Anonim ihbarlar | Şüpheli adı, konum, ihbar detayı |

### 2. Üç Farklı Görünüm Modu

- **Kartlar**: Grid düzeninde tüm kanıtları görüntüle
- **Timeline**: Kronolojik dikey zaman çizelgesi
- **Harita**: Leaflet.js ile interaktif harita görselleştirmesi

### 3. Akıllı Arama ve Filtreleme

- Anlık arama (tüm alanlarda)
- Form tipine göre filtreleme (toggle butonları)
- Tıklanabilir isimler (isim tıklanınca otomatik arama)

### 4. Podo Takip Sistemi

- **Doğrudan Podo kayıtları**: Sarı vurgulu `PODO` badge'i
- **Podo'dan bahsedilen kayıtlar**: `Podo'dan bahsedildi` etiketi
- **Podo'nun Rotası**: Haritada sadece Podo'nun gittiği konumları ve sırasını gösteren özel mod

### 5. Veri Doğrulama (Data Validation)

- Geçersiz/eksik kayıtlar otomatik filtrelenir
- Minimum karakter kontrolü (spam/test verisi önleme)
- Tarih formatı doğrulama

### 6. Modern UI/UX

- Dark mode tasarım
- Sabit boyutlu kartlar (tutarlı grid)
- Responsive tasarım (mobil uyumlu)
- Hover efektleri ve smooth geçişler

---

## Teknik Mimari

### Teknoloji Stack'i

| Teknoloji | Versiyon | Kullanım Amacı |
|-----------|----------|----------------|
| Next.js | 16.2.4 | App Router, Server/Client Components |
| React | 19.2.4 | UI Framework |
| TypeScript | 5.x | Tip güvenliği |
| Tailwind CSS | 4.x | Styling |
| Leaflet | 1.9.4 | Harita görselleştirme |
| React-Leaflet | 5.0.0 | React Leaflet wrapper |

### Dosya Yapısı

```
2026-frontend-challenge-izmir/
├── app/
│   ├── layout.tsx          # Root layout (dark mode, metadata)
│   ├── page.tsx             # Ana sayfa (Server Component - veri çekimi)
│   └── globals.css          # Global stiller ve CSS değişkenleri
├── components/
│   ├── DetectiveBoard.tsx   # Ana konteyner (Client Component)
│   ├── SearchBar.tsx        # Arama çubuğu
│   ├── FilterTabs.tsx       # Form tipi filtreleri
│   ├── EvidenceCard.tsx     # Kanıt kartı (5 farklı tip)
│   ├── Timeline.tsx         # Kronolojik zaman çizelgesi
│   ├── EvidenceMap.tsx      # Harita wrapper (dynamic import)
│   ├── MapContent.tsx       # Leaflet harita içeriği
│   └── ClickableTag.tsx     # Tıklanabilir isim etiketi
├── lib/
│   ├── jotform.ts           # JotForm API client
│   ├── types.ts             # TypeScript tip tanımları
│   ├── utils.ts             # Yardımcı fonksiyonlar
│   └── constants.ts         # Sabitler ve konfigürasyon
└── .env.local               # API anahtarı (git'e dahil değil)
```

### Mimari Kararlar

#### 1. Server Component vs Client Component Ayrımı

```
┌─────────────────────────────────────────────────────────┐
│  page.tsx (Server Component)                            │
│  └── JotForm API'den veri çekimi                        │
│      └── getAllEvidence()                               │
└─────────────────────┬───────────────────────────────────┘
                      │ props olarak veri aktarımı
                      ▼
┌─────────────────────────────────────────────────────────┐
│  DetectiveBoard.tsx (Client Component)                  │
│  └── useState, useMemo ile interaktif UI               │
│      ├── SearchBar (arama)                              │
│      ├── FilterTabs (filtreleme)                        │
│      ├── EvidenceCard (kartlar)                         │
│      ├── Timeline (zaman çizelgesi)                     │
│      └── EvidenceMap (harita)                           │
└─────────────────────────────────────────────────────────┘
```

**Neden bu yapı?**
- API anahtarı sunucu tarafında kalır (güvenlik)
- Veri çekimi build/request zamanında yapılır (performans)
- İstemci tarafında sadece interaktivite (SEO dostu)

#### 2. Leaflet SSR Sorunu Çözümü

Leaflet `window` objesine ihtiyaç duyar, Next.js ise sunucu tarafında render yapar. Bu sorunu çözmek için:

```typescript
// EvidenceMap.tsx
const MapContent = dynamic(() => import("./MapContent"), { ssr: false });
```

`dynamic` import ile `MapContent` sadece istemci tarafında yüklenir.

#### 3. Veri Normalizasyonu

JotForm API'den gelen ham veri:
```json
{
  "answers": {
    "1": { "answer": "Podo", "name": "fullname" },
    "2": { "answer": "Alsancak", "name": "location" }
  }
}
```

Normalize edilmiş veri:
```typescript
{
  id: "123",
  formType: "checkins",
  fullname: "Podo",
  location: "Alsancak",
  timestamp: "25-04-2026 10:30"
}
```

#### 4. Türkçe Karakter Normalizasyonu

Haritada aynı lokasyonları gruplamak için Türkçe karakterler normalize edilir:

```typescript
const normalizedLocation = location
  .toLowerCase()
  .replace(/ı/g, "i")
  .replace(/ş/g, "s")
  .replace(/ğ/g, "g")
  .replace(/ü/g, "u")
  .replace(/ö/g, "o")
  .replace(/ç/g, "c");
```

Bu sayede "Konak Meydanı" ve "Konak Meydani" aynı nokta olarak işlenir.

---

## Kurulum

### Gereksinimler

- Node.js 18+ veya Bun
- JotForm API Anahtarı

### Adımlar

1. **Repoyu klonla**
```bash
git clone <repo-url>
cd 2026-frontend-challenge-izmir
```

2. **Bağımlılıkları yükle**
```bash
npm install
# veya
bun install
```

3. **Ortam değişkenlerini ayarla**
```bash
# .env.local dosyası oluştur
echo "JOTFORM_API_KEY=your_api_key_here" > .env.local
```

4. **Geliştirme sunucusunu başlat**
```bash
npm run dev
# veya
bun dev
```

5. **Tarayıcıda aç**
```
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

---

## Kullanım Kılavuzu

### Arama Yapma
Üstteki arama çubuğuna herhangi bir kelime yazın. Tüm kanıtlarda (isim, konum, mesaj, not) arama yapılır.

### Filtreleme
Form tipi butonlarına tıklayarak belirli kanıt tiplerini göster/gizle yapabilirsiniz.

### Görünüm Değiştirme
- **Kartlar**: Tüm kanıtları grid düzeninde görüntüler
- **Timeline**: Olayları kronolojik sırayla dikey çizgide gösterir
- **Harita**: Koordinatı olan kanıtları harita üzerinde işaretler

### Podo'nun Rotası
Harita görünümünde "Podo'nun Rotası" butonuna tıklayarak:
- Sadece Podo'nun bulunduğu konumları görüntüleyin
- Zaman sırasına göre ok işaretleriyle rotayı takip edin
- Her noktada Podo'nun orada bulunduğu saatleri görün

### İsim Tıklama
Herhangi bir isimdeki sarı/mavi etikete tıklayarak o kişiyle ilgili tüm kayıtları anında filtreleyin.

---

## Öne Çıkan Teknik Detaylar

### 1. Type-Safe API Client

```typescript
// lib/types.ts - Discriminated Union Pattern
export type Evidence =
  | Checkin      // formType: "checkins"
  | Message      // formType: "messages"
  | Sighting     // formType: "sightings"
  | PersonalNote // formType: "personalNotes"
  | AnonymousTip; // formType: "anonymousTips"
```

TypeScript'in discriminated union özelliği ile her form tipi için tip güvenliği sağlanır.

### 2. Merkezi Konfigürasyon

```typescript
// lib/constants.ts
export const FORM_LABELS: Record<FormType, string> = {
  checkins: "Check-in'ler",
  messages: "Mesajlar",
  // ...
};
```

Tüm etiketler, renkler ve ayarlar tek dosyada yönetilir.

### 3. Podo Algılama Sistemi

```typescript
// lib/utils.ts
export function getPodoLevel(item: Evidence): PodoLevel {
  // "direct" - Podo'nun kendi kaydı
  // "mentioned" - Podo'dan bahsediliyor
  // "none" - Podo ile ilgisi yok
}
```

İki seviyeli vurgulama sistemi ile Podo'nun doğrudan dahil olduğu ve sadece bahsedildiği kayıtlar ayrılır.

### 4. Performans Optimizasyonları

- `useMemo` ile filtreleme sonuçları cache'lenir
- Harita bileşeni lazy-load edilir
- Server Component'te veri çekimi (client bundle'a API kodu dahil değil)

---

## Geliştirme Notları

### Yapılabilecek İyileştirmeler

- [ ] Kanıt detay modalı
- [ ] Haritada marker clustering
- [ ] Karanlık/Aydınlık mod toggle
- [ ] Daha fazla animasyon
- [ ] PWA desteği

### Bilinen Sınırlamalar

- Koordinatı olmayan kayıtlar haritada görünmez
- API rate limit'e dikkat edilmeli

---

## Proje Hakkında

Bu proje, **JotForm 2026 Frontend Challenge - İzmir** kapsamında geliştirilmiştir.

### Geliştirici

**Enes Hoşgör**

### Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

---

## Teşekkürler

- JotForm ekibine bu challenge için
- Next.js ve React ekiplerine harika araçlar için
- Leaflet topluluğuna açık kaynak harita kütüphanesi için
