# 💝 Bucin Web — Interactive Romantic Surprise App

Template web kejutan romantis yang **interaktif, estetik, dan mobile-first**.
Alurnya: **QR / PIN Lock Screen → Amplop & Surat Beranimasi → Tiga Hadiah (Galeri, Buket Bunga, Music Player)**.

Semua konten (foto, teks, lagu, PIN, warna) diatur dari **satu file**: `src/config/bucinData.ts`.

---

## ✨ Fitur

| Stage | Fitur |
|---|---|
| **1. Lock Screen** | PIN pad digital, feedback animasi per tombol, haptic vibrate, SFX, modal "PIN salah" yang cute, auto-hint setelah 2× salah, confetti hati saat berhasil, **QR code generator** untuk share |
| **2. Envelope & Letter** | Amplop 3D dengan **wax seal hati**, animasi buka, surat multi-halaman dengan **page-turn 3D**, dot navigasi, dukungan keyboard ⟵ ⟶ |
| **3. Gift Hub** | Dashboard "Three Special Gifts" + progress tracker + **finale modal** setelah semua hadiah dibuka |
| ↳ Our Memories | Polaroid grid dengan **tilt 3D mengikuti kursor**, hover zoom, **lightbox** navigasi, timeline horizontal scroll |
| ↳ Flowers For You | Buket **SVG yang mekar otomatis** (stem animation → bunga bermekaran → pita), kelopak jatuh di background, quote rotator |
| ↳ Our Song | Player custom: **vinyl berputar + tonearm**, seekbar, volume, loop, **audio visualizer 40-bar (Web Audio API)**, playlist card |
| **Global** | Musik latar yang **tidak mati saat pindah stage** (auto-duck saat lagu diputar), canvas bintang berkelip + hati melayang, aurora blobs, film grain, dukungan `prefers-reduced-motion` |

---

## 🧱 Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (page transitions & micro-interactions)
- **canvas-confetti** (custom heart shape)
- **lucide-react** (icons)
- **qrcode** (QR code di-generate di browser)
- **Docker** + **railway.json** (siap deploy ke Railway)

---

## 🚀 Menjalankan Lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000 — PIN default: **`1204`**

Perintah lain:

```bash
npm run build      # build produksi
npm run start      # jalankan hasil build
npm run typecheck  # cek TypeScript
npm run lint       # cek ESLint
```

---

## 🎨 Kustomisasi (baca `CUSTOMIZE.md` untuk detail)

Semua ada di **`src/config/bucinData.ts`**. Contoh cepat:

```ts
export const securityConfig = {
  pinCode: "0712",                                  // ← tanggal jadian kalian
  pinHint: "Hint: tanggal jadian kita 💕 (DDMM)",
  ...
};

export const memoryGallery = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-xxxxx", // ← URL foto
    caption: "Malam pertama kita jalan bareng",
    date: "12 April 2023",
  },
  ...
];
```

**Ganti foto** — dua cara:
1. **URL internet**: `imageUrl: "https://images.unsplash.com/photo-..."`
   Kalau domainnya baru, daftarkan di `next.config.ts` → `images.remotePatterns`.
2. **File lokal**: taruh di `public/photos/`, tulis `imageUrl: "/photos/namafile.jpg"`.

**Ganti lagu** — `audioUrl` harus link **file .mp3 langsung** (link Spotify/YouTube tidak bisa diputar `<audio>`). Taruh file di `public/music/` lalu tulis `/music/lagu.mp3`.

---

## 🐳 Docker

```bash
docker build -t bucin-web .
docker run -p 3000:3000 bucin-web
```

Image memakai `output: "standalone"` → ukuran akhir kecil (~150 MB).

---

## 🚂 Deploy ke Railway

1. Push project ini ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: bucin surprise web app"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
2. Buka [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → pilih repo ini.
3. Railway otomatis membaca `railway.json` dan build via `Dockerfile`. **Tidak perlu set env var apa pun** — `PORT` diisi Railway otomatis.
4. Setelah deploy: **Settings → Networking → Generate Domain**.
5. Buka domainnya, tekan tombol **QR Code** di lock screen, lalu kirim/tunjukkan QR-nya ke dia. 💝

> Alternatif tanpa Docker: hapus `railway.json`, Railway akan memakai Nixpacks dan menjalankan `npm run build` + `npm run start` (script `start` sudah membaca `$PORT`).

---

## 📁 Struktur Project

```
bucin-web/
├── Dockerfile                 # multi-stage build (deps → builder → runner)
├── railway.json               # konfigurasi deploy Railway
├── next.config.ts             # output standalone + remotePatterns gambar
├── postcss.config.mjs         # Tailwind v4
├── eslint.config.mjs
├── tsconfig.json
├── package.json
├── .env.example
├── CUSTOMIZE.md               # panduan ganti konten
├── public/
│   ├── photos/                # 8 foto memori (ganti dengan fotomu)
│   ├── covers/                # cover album
│   └── music/                 # 4 lagu + 1 ambient background
└── src/
    ├── app/
    │   ├── layout.tsx         # font, metadata, favicon emoji
    │   ├── page.tsx           # state machine 3 stage + AnimatePresence
    │   └── globals.css        # tema, utilities, keyframes
    ├── components/
    │   ├── BackgroundFX.tsx      # canvas bintang + hati + aurora
    │   ├── BackgroundMusic.tsx   # widget musik latar (persist antar stage)
    │   ├── LockScreen.tsx        # STAGE 1
    │   ├── QrShare.tsx           # QR code generator
    │   ├── LetterModal.tsx       # STAGE 2 (amplop + surat)
    │   ├── GiftHub.tsx           # STAGE 3 (dashboard 3 hadiah)
    │   ├── MemoryGallery.tsx     # hadiah 1
    │   ├── VirtualBouquet.tsx    # hadiah 2
    │   └── MusicPlayer.tsx       # hadiah 3
    ├── config/
    │   └── bucinData.ts       # ⭐ SATU-SATUNYA FILE YANG PERLU DIEDIT
    └── lib/
        ├── confetti.ts        # heart explosion, heart rain, gold shower
        ├── hooks.ts           # reduced motion, haptic, lock scroll, dll
        └── sound.ts           # SFX Web Audio (tanpa file audio)
```

---

## 🎨 Palet Warna

| Nama | Hex | Pakai untuk |
|---|---|---|
| Midnight Navy | `#0f172a` | background dasar |
| Dark Velvet | `#1e1b4b` | gradient background |
| Pastel Pink | `#f472b6` | aksen utama, tombol |
| Rose | `#fb7185` | aksen sekunder |
| Gold | `#fcd34d` | highlight, quote |

Ubah di `src/config/bucinData.ts` → `themeConfig`, dan di `src/app/globals.css` → blok `@theme`.

---

## 📝 Catatan

- **Autoplay**: browser modern memblokir autoplay audio. Musik latar sengaja baru mulai **setelah PIN benar** (interaksi user pertama) supaya lolos kebijakan tersebut.
- **Audio dari domain lain**: visualizer memakai Web Audio API yang butuh header CORS. Kalau `audioUrl` dari CDN tanpa CORS, player tetap jalan tapi visualizer memakai mode simulasi (tetap bergoyang, hanya tidak sinkron nada).
- **Aset bawaan**: foto & musik di `public/` adalah placeholder yang dibuat khusus untuk template ini — ganti dengan milikmu sendiri.

---

Dibuat dengan 💗 — semoga dia suka.
