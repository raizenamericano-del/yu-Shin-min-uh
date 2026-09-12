# 🎀 Panduan Kustomisasi

Semua yang perlu kamu ubah ada di **satu file**: `src/config/bucinData.ts`.
Kamu tidak perlu menyentuh file komponen sama sekali.

Cari emoji ✏️ di file itu — itu penanda baris yang paling sering diganti.

---

## 1. Ganti PIN

```ts
export const securityConfig = {
  pinCode: "1204",                                    // ✏️ 4 digit (bisa juga 6 digit)
  pinHint: "Hint: tanggal & bulan jadian kita 💕",     // ✏️
  lockTitle: "Ada Sesuatu Untukmu",                   // ✏️
  lockSubtitle: "Masukkan kode rahasia kita...",      // ✏️
  wrongPinTitle: "Yah, salah nih 🥺",                 // ✏️
  wrongPinMessage: "Coba diingat lagi ya sayang...",  // ✏️
  maxAttemptsBeforeHint: 2,
};
```

> Panjang PIN mengikuti panjang string `pinCode` — tulis `"071223"` kalau mau 6 digit.

---

## 2. Ganti Isi Surat

```ts
export const letterConfig = {
  recipientName: "Sayangku",           // ✏️ nama dia
  senderName: "Yang selalu kangen",    // ✏️ nama kamu
  title: "Surat Kecil Dari Aku",
  pages: [
    "Paragraf halaman 1...",   // ← 1 string = 1 lembar surat
    "Paragraf halaman 2...",
    "Paragraf halaman 3...",
  ],
  closingNote: "Dengan sayang, selalu.",
};
```

Tambah/kurangi jumlah halaman cukup dengan menambah/menghapus item di array `pages`.
Dot navigasi & tombol "Hadiah" menyesuaikan otomatis.

---

## 3. Ganti Foto Galeri

### Opsi A — pakai URL internet (paling gampang)

```ts
export const memoryGallery = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
    caption: "Malam pertama kita jalan bareng",
    date: "12 April 2023",
    tilt: -4,       // rotasi polaroid, opsional
  },
];
```

⚠️ Kalau domainnya belum terdaftar, tambahkan ke `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: "https", hostname: "images.unsplash.com" },
    { protocol: "https", hostname: "DOMAIN-BARU-KAMU.com" },  // ← tambah di sini
  ],
},
```

Host yang **sudah** terdaftar: `images.unsplash.com`, `plus.unsplash.com`,
`res.cloudinary.com`, `i.ibb.co`, `raw.githubusercontent.com`,
`lh3.googleusercontent.com`, `drive.google.com`.

### Opsi B — upload file sendiri

1. Taruh foto di folder `public/photos/`
2. Tulis path-nya:

```ts
imageUrl: "/photos/foto-kita.jpg",
```

**Tips foto:** rasio potret **3:4** paling pas untuk layout polaroid. Kompres dulu
ke < 400 KB (pakai [squoosh.app](https://squoosh.app)) supaya loading cepat.

### Cara cepat dapat URL Unsplash

Buka [unsplash.com](https://unsplash.com), klik foto → klik kanan gambar →
**Copy image address**. Tambahkan `?w=800&q=80` di akhir supaya ringan.

---

## 4. Ganti Buket Bunga

```ts
export const bouquetConfig = {
  title: "Flowers For You",
  message: "Pesan romantis panjang di samping buket...",
  flowerColor: "#f472b6",           // ✏️ warna kelopak utama
  flowerColorSecondary: "#fb7185",  // ✏️ warna kelopak variasi
  flowerCenterColor: "#fcd34d",     // ✏️ warna tengah bunga
  flowerCount: 9,                   // ✏️ jumlah tangkai (5–12 paling cantik)
  signature: "Buat kamu, yang selalu bikin hariku wangi 🌸",
  quotes: [                         // ✏️ berganti otomatis tiap 5 detik
    "Kamu itu rumah yang bisa aku bawa ke mana-mana.",
    "Kalau bahagia bisa dibungkus, aku kirim setiap hari.",
  ],
};
```

Ide kombinasi warna:
- **Mawar merah**: `#f43f5e` / `#e11d48` / `#fcd34d`
- **Lavender**: `#a78bfa` / `#c4b5fd` / `#fde68a`
- **Sunflower**: `#fbbf24` / `#f59e0b` / `#78350f`
- **Baby blue**: `#7dd3fc` / `#38bdf8` / `#fef3c7`

---

## 5. Ganti Lagu

```ts
export const playlistConfig = {
  featuredSong: {
    id: 0,
    title: "Our Song",
    artist: "Nama Artis",
    audioUrl: "/music/lagu-kita.mp3",   // ✏️
    coverUrl: "/covers/cover-01.jpg",   // ✏️
    dedication: "Lagu yang muter terus di kepalaku.",
  },
  playlist: [ /* array lagu, format sama */ ],
};
```

### ⚠️ Penting soal `audioUrl`

`<audio>` HTML hanya bisa memutar **link file audio langsung**. Yang **TIDAK bisa**:
- ❌ `https://open.spotify.com/track/...`
- ❌ `https://youtube.com/watch?v=...`

Yang **bisa**:
- ✅ File lokal: taruh `.mp3` di `public/music/` → `audioUrl: "/music/lagu.mp3"`
- ✅ Direct link dari Cloudinary / Supabase Storage / GitHub Raw / server sendiri

**Cara termudah:** download `.mp3`-nya, taruh di `public/music/`, selesai.

> Musik dari domain lain tanpa header CORS tetap bisa diputar, tapi visualizer
> akan memakai mode simulasi (bar tetap bergoyang, hanya tidak sinkron nada).

---

## 6. Ganti Musik Latar

```ts
export const ambienceConfig = {
  backgroundMusicUrl: "/music/ambient-background.mp3",  // ✏️
  backgroundMusicTitle: "Ambience — Buat Kita",
  backgroundMusicVolume: 0.35,      // 0 – 1
  enableFloatingHearts: true,       // hati melayang di background
  enableTwinklingStars: true,       // bintang berkelip
  enableCursorSparkle: true,
};
```

Musik latar mulai otomatis setelah PIN benar, dan **volumenya otomatis mengecil**
saat kamu memutar lagu dari playlist.

---

## 7. Ganti Teks Hub & Finale

```ts
export const hubConfig = {
  greeting: "Untukmu,",
  title: "Three Special Gifts",
  subtitle: "Pilih satu... atau semuanya 💝",
  cards: {
    memories: { title: "Our Memories", description: "...", badge: "Gallery" },
    bouquet:  { title: "Flowers For You", description: "...", badge: "Bouquet" },
    playlist: { title: "Our Song", description: "...", badge: "Music" },
  },
  finaleTitle: "Terima kasih sudah membuka semuanya 💗",
  finaleMessage: "Pesan penutup...",
  finaleButton: "Ulangi Kejutannya",
};
```

Modal finale muncul otomatis setelah ketiga hadiah dibuka.

---

## 8. Ganti Warna Tema

Dua tempat harus disamakan:

**a) `src/config/bucinData.ts`**

```ts
export const themeConfig = {
  bgDeep: "#0f172a",
  bgVelvet: "#1e1b4b",
  pink: "#f472b6",
  rose: "#fb7185",
  gold: "#fcd34d",
};
```

**b) `src/app/globals.css`** → blok `@theme`

```css
@theme {
  --color-midnight: #0f172a;
  --color-velvet: #1e1b4b;
  --color-blush: #f472b6;
  --color-rose: #fb7185;
  --color-gold: #fcd34d;
}
```

Untuk mengubah gradient background utama, edit `body { background: ... }` di file CSS yang sama.

---

## 9. Ganti Judul Tab & Favicon

```ts
export const siteMeta = {
  siteTitle: "A Little Surprise For You 💝",   // ✏️ judul tab browser
  siteDescription: "Sebuah kejutan kecil...",  // ✏️ preview saat link dishare
  favicon: "💝",                               // ✏️ emoji apa saja
};
```

---

## 10. QR Code

```ts
export const qrConfig = {
  enabled: true,
  targetUrl: "",          // kosong = otomatis pakai URL halaman saat ini
  title: "Scan Kejutannya",
  description: "Tunjukkan / kirim QR ini ke dia.",
  buttonLabel: "Tampilkan QR Code",
};
```

Setelah deploy ke Railway, buka website → klik **Tampilkan QR Code** →
screenshot atau tunjukkan langsung ke dia. Bisa juga diprint dan diselipkan di kado fisik 🎁

Set `enabled: false` kalau tidak mau tombol QR muncul.

---

## ✅ Checklist Sebelum Deploy

- [ ] PIN sudah diganti ke tanggal spesial kalian
- [ ] Nama penerima & pengirim sudah benar
- [ ] Isi surat sudah ditulis ulang (jangan pakai teks contoh 😅)
- [ ] Semua foto placeholder sudah diganti dengan foto kalian
- [ ] Caption & tanggal tiap foto sudah sesuai
- [ ] Lagu sudah diganti (dan sudah dicek bisa diputar)
- [ ] Pesan buket & quotes sudah dipersonalisasi
- [ ] Pesan finale sudah diganti
- [ ] Judul tab browser sudah diganti
- [ ] Sudah dites di HP (bukan cuma desktop!)
- [ ] `npm run build` lolos tanpa error

Selamat, semoga dia suka 💝
