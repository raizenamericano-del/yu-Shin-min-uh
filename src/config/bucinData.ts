/* ============================================================================
 *  bucinData.ts  —  SATU-SATUNYA FILE YANG PERLU KAMU EDIT  💝
 * ----------------------------------------------------------------------------
 *  Semua teks, foto, lagu, PIN, dan warna ada di sini.
 *  Kamu TIDAK perlu menyentuh file komponen apa pun.
 *
 *  CARA GANTI FOTO / LAGU:
 *   1. Pakai URL internet  ->  imageUrl: "https://images.unsplash.com/photo-xxxx"
 *      (kalau host-nya baru, daftarkan di next.config.ts -> images.remotePatterns)
 *   2. Pakai file lokal    ->  taruh file di folder /public/photos,
 *                              lalu tulis  imageUrl: "/photos/namafile.jpg"
 *
 *  Emoji ✏️ menandai baris yang paling sering diganti.
 * ==========================================================================*/

/* -------------------------------------------------------------------------- */
/*  TYPES                                                                     */
/* -------------------------------------------------------------------------- */

export interface SecurityConfig {
  pinCode: string;
  pinHint: string;
  lockTitle: string;
  lockSubtitle: string;
  wrongPinTitle: string;
  wrongPinMessage: string;
  maxAttemptsBeforeHint: number;
}

export interface LetterConfig {
  recipientName: string;
  senderName: string;
  title: string;
  envelopeHint: string;
  pages: string[];
  closingNote: string;
}

export interface MemoryItem {
  id: number;
  imageUrl: string;
  caption: string;
  date: string;
  /** Rotasi polaroid (derajat). Biarkan kosong = otomatis. */
  tilt?: number;
}

export interface BouquetConfig {
  title: string;
  message: string;
  /** Warna utama kelopak bunga (hex). */
  flowerColor: string;
  /** Warna sekunder untuk variasi bunga (hex). */
  flowerColorSecondary: string;
  /** Warna aksen tengah bunga (hex). */
  flowerCenterColor: string;
  flowerCount: number;
  signature: string;
  quotes: string[];
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
  /** Baris lirik/pesan singkat yang muncul di player (opsional). */
  dedication?: string;
}

export interface PlaylistConfig {
  title: string;
  subtitle: string;
  featuredSong: Song;
  playlist: Song[];
}

export interface GalleryConfig {
  title: string;
  subtitle: string;
  items: MemoryItem[];
}

export interface HubConfig {
  greeting: string;
  title: string;
  subtitle: string;
  cards: {
    memories: { title: string; description: string; badge: string };
    bouquet: { title: string; description: string; badge: string };
    playlist: { title: string; description: string; badge: string };
  };
  finaleTitle: string;
  finaleMessage: string;
  finaleButton: string;
}

export interface QrConfig {
  enabled: boolean;
  /** Kosongkan ("") supaya otomatis memakai URL website saat ini. */
  targetUrl: string;
  title: string;
  description: string;
  buttonLabel: string;
}

export interface ThemeConfig {
  bgDeep: string;
  bgVelvet: string;
  pink: string;
  rose: string;
  gold: string;
  fontDisplay: string;
  fontBody: string;
}

export interface AmbienceConfig {
  backgroundMusicUrl: string;
  backgroundMusicTitle: string;
  backgroundMusicVolume: number;
  enableFloatingHearts: boolean;
  enableTwinklingStars: boolean;
  enableCursorSparkle: boolean;
}

export interface SiteMeta {
  siteTitle: string;
  siteDescription: string;
  favicon: string;
}

/* -------------------------------------------------------------------------- */
/*  1. SECURITY  —  PIN LOCK SCREEN                                           */
/* -------------------------------------------------------------------------- */

export const securityConfig: SecurityConfig = {
  pinCode: "1204", // ✏️ Tanggal jadian / ulang tahun (4 digit)
  pinHint: "Hint: Tanggal & bulan jadian kita 💕 (DDMM)", // ✏️
  lockTitle: "Ada Sesuatu Untukmu", // ✏️
  lockSubtitle: "Masukkan kode rahasia kita untuk membuka kejutan ini", // ✏️
  wrongPinTitle: "Yah, salah nih 🥺", // ✏️
  wrongPinMessage: "Coba diingat lagi ya sayang, tanggal spesial kita...", // ✏️
  maxAttemptsBeforeHint: 2, // setelah 2x salah, hint muncul otomatis
};

/* -------------------------------------------------------------------------- */
/*  2. SURAT / LOVE LETTER                                                    */
/* -------------------------------------------------------------------------- */

export const letterConfig: LetterConfig = {
  recipientName: "Sayangku", // ✏️
  senderName: "Yang selalu kangen kamu", // ✏️
  title: "Surat Kecil Dari Aku", // ✏️
  envelopeHint: "Ketuk amplopnya untuk membuka",
  // ✏️ Setiap string di bawah = 1 lembar surat. Tambah/kurangi sesukamu.
  pages: [
    "Halo, kamu. Aku nggak tahu harus mulai dari mana, jadi aku mulai dari yang paling jujur saja: terima kasih sudah ada. Terima kasih sudah bertahan, sudah sabar, sudah mau mengenal versi diriku yang bahkan aku sendiri belum selesai pahami.",
    "Aku masih ingat hari pertama kita ngobrol lama sampai lupa waktu. Waktu itu aku pikir ini cuma obrolan biasa. Ternyata itu awal dari semua hal favoritku: suara ketawamu, caramu cerita hal receh dengan semangat, dan caramu bilang 'hati-hati di jalan' yang selalu bikin aku senyum sendiri.",
    "Nggak semua hari kita indah, aku tahu. Ada hari di mana kita capek, salah paham, dan diam-diaman. Tapi entah kenapa, kita selalu pulang ke satu sama lain. Buatku itu bukan kebetulan — itu pilihan yang kita ambil berulang kali, dan aku akan terus memilihmu.",
    "Kalau nanti aku lupa bilang, izinkan surat ini yang mengingatkanmu: kamu berharga. Bukan karena apa yang kamu lakukan untukku, tapi karena kamu adalah kamu. Aku bangga sama kamu, bahkan di hari-hari kamu merasa biasa saja.",
    "Jadi, di halaman terakhir ini aku cuma mau bilang — aku sayang kamu. Hari ini, besok, dan di semua versi hari yang belum kita jalani. Sekarang, lanjut ya... aku sudah siapkan tiga hadiah kecil buat kamu. 💝",
  ],
  closingNote: "Dengan sayang, selalu.",
};

/* -------------------------------------------------------------------------- */
/*  3. GALERI KENANGAN                                                        */
/* -------------------------------------------------------------------------- */
/*  Ganti imageUrl dengan URL fotomu sendiri, atau taruh file di /public/photos */

export const memoryGallery: MemoryItem[] = [
  {
    id: 1,
    imageUrl: "/photos/memory-01.jpg", // ✏️ bisa juga "https://images.unsplash.com/photo-..."
    caption: "Malam pertama kita jalan bareng, hujan pun jadi bagus",
    date: "12 April 2023",
    tilt: -4,
  },
  {
    id: 2,
    imageUrl: "/photos/memory-02.jpg",
    caption: "Kopi berdua, obrolan yang nggak pernah selesai",
    date: "3 Juni 2023",
    tilt: 3,
  },
  {
    id: 3,
    imageUrl: "/photos/memory-03.jpg",
    caption: "Sunset itu bagus, tapi kamu lebih",
    date: "21 Agustus 2023",
    tilt: -2,
  },
  {
    id: 4,
    imageUrl: "/photos/memory-04.jpg",
    caption: "Rooftop, selimut, dan rencana masa depan kita",
    date: "9 November 2023",
    tilt: 5,
  },
  {
    id: 5,
    imageUrl: "/photos/memory-05.jpg",
    caption: "Piknik dadakan yang ternyata jadi hari favoritku",
    date: "14 Februari 2024",
    tilt: -3,
  },
  {
    id: 6,
    imageUrl: "/photos/memory-06.jpg",
    caption: "Bunga pertama yang aku kasih, kamu simpan sampai kering",
    date: "2 Mei 2024",
    tilt: 2,
  },
  {
    id: 7,
    imageUrl: "/photos/memory-07.jpg",
    caption: "Pulang malam, lampu kota, dan pelukan di belakang",
    date: "18 Juli 2024",
    tilt: -5,
  },
  {
    id: 8,
    imageUrl: "/photos/memory-08.jpg",
    caption: "Ulang tahunmu — lilin kecil, doa besar",
    date: "4 Desember 2024",
    tilt: 4,
  },
];

export const galleryConfig: GalleryConfig = {
  title: "Our Memories", // ✏️
  subtitle: "Beberapa potongan hari yang nggak mau aku lupakan", // ✏️
  items: memoryGallery,
};

/* -------------------------------------------------------------------------- */
/*  4. BUKET BUNGA VIRTUAL                                                    */
/* -------------------------------------------------------------------------- */

export const bouquetConfig: BouquetConfig = {
  title: "Flowers For You", // ✏️
  message:
    "Buket ini nggak akan layu, sama seperti rasa yang aku simpan buat kamu. Setiap kelopaknya aku titipkan satu alasan kenapa aku sayang kamu — dan sejujurnya, kelopaknya kurang banyak.", // ✏️
  flowerColor: "#f472b6", // ✏️ pink pastel
  flowerColorSecondary: "#fb7185", // ✏️ rose
  flowerCenterColor: "#fcd34d", // ✏️ gold
  flowerCount: 9, // jumlah tangkai bunga (5–12 paling cantik)
  signature: "Buat kamu, yang selalu bikin hariku wangi 🌸", // ✏️
  quotes: [
    "Kamu itu rumah yang bisa aku bawa ke mana-mana.",
    "Kalau bahagia bisa dibungkus, aku kirim setiap hari.",
    "Terima kasih sudah jadi alasan aku pulang cepat.",
  ],
};

/* -------------------------------------------------------------------------- */
/*  5. MUSIK & PLAYLIST                                                       */
/* -------------------------------------------------------------------------- */
/*  audioUrl bisa file lokal (/music/xxx.mp3) atau URL langsung ke file .mp3   */
/*  Catatan: link Spotify/YouTube TIDAK bisa dipakai di <audio>.               */

export const playlistConfig: PlaylistConfig = {
  title: "Our Song & Playlist", // ✏️
  subtitle: "Lagu-lagu yang selalu ngingetin aku sama kamu", // ✏️
  featuredSong: {
    id: 0,
    title: "Our Song", // ✏️
    artist: "Cuma Buat Kamu", // ✏️
    audioUrl: "/music/song-01-our-song.mp3", // ✏️
    coverUrl: "/covers/cover-01.jpg", // ✏️
    dedication: "Lagu yang muter terus di kepalaku tiap inget kamu.",
  },
  playlist: [
    {
      id: 1,
      title: "Our Song",
      artist: "Cuma Buat Kamu",
      audioUrl: "/music/song-01-our-song.mp3",
      coverUrl: "/covers/cover-01.jpg",
      dedication: "Lagu yang muter terus di kepalaku tiap inget kamu.",
    },
    {
      id: 2,
      title: "Midnight Talks",
      artist: "Late Night Us",
      audioUrl: "/music/song-02-midnight.mp3",
      coverUrl: "/covers/cover-02.jpg",
      dedication: "Buat semua obrolan jam 2 pagi yang nggak mau kita sudahi.",
    },
    {
      id: 3,
      title: "Sunset Drive",
      artist: "Golden Hour",
      audioUrl: "/music/song-03-sunset.mp3",
      coverUrl: "/covers/cover-01.jpg",
      dedication: "Soundtrack perjalanan pulang paling sepi tapi paling hangat.",
    },
    {
      id: 4,
      title: "Lullaby For You",
      artist: "Sleep Tight",
      audioUrl: "/music/song-04-lullaby.mp3",
      coverUrl: "/covers/cover-02.jpg",
      dedication: "Kalau kamu susah tidur, dengerin ini dan bayangin aku peluk.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  6. HUB — TIGA HADIAH                                                      */
/* -------------------------------------------------------------------------- */

export const hubConfig: HubConfig = {
  greeting: "Untukmu,", // ✏️
  title: "Three Special Gifts", // ✏️
  subtitle: "Pilih satu... atau semuanya. Toh semuanya buat kamu 💝", // ✏️
  cards: {
    memories: {
      title: "Our Memories",
      description: "Album kecil berisi hari-hari favoritku bareng kamu.",
      badge: "Gallery",
    },
    bouquet: {
      title: "Flowers For You",
      description: "Buket yang mekar sendiri dan nggak akan pernah layu.",
      badge: "Bouquet",
    },
    playlist: {
      title: "Our Song",
      description: "Playlist yang isinya kamu, kamu, dan kamu lagi.",
      badge: "Music",
    },
  },
  finaleTitle: "Terima kasih sudah membuka semuanya 💗", // ✏️
  finaleMessage:
    "Kejutan kecil ini nggak akan pernah cukup buat menggambarkan seberapa berartinya kamu. Tapi semoga hari ini kamu tahu satu hal: kamu sangat, sangat disayang.", // ✏️
  finaleButton: "Ulangi Kejutannya",
};

/* -------------------------------------------------------------------------- */
/*  7. QR CODE SHARE                                                          */
/* -------------------------------------------------------------------------- */

export const qrConfig: QrConfig = {
  enabled: true,
  targetUrl: "", // ✏️ kosong = otomatis pakai URL halaman ini
  title: "Scan Kejutannya",
  description:
    "Tunjukkan / kirim QR ini ke dia. Sekali scan, kejutannya langsung terbuka di HP-nya.",
  buttonLabel: "Tampilkan QR Code",
};

/* -------------------------------------------------------------------------- */
/*  8. TEMA WARNA                                                             */
/* -------------------------------------------------------------------------- */

export const themeConfig: ThemeConfig = {
  bgDeep: "#0f172a", // midnight navy
  bgVelvet: "#1e1b4b", // dark velvet
  pink: "#f472b6",
  rose: "#fb7185",
  gold: "#fcd34d",
  fontDisplay: '"Playfair Display", Georgia, serif',
  fontBody: '"Inter", system-ui, sans-serif',
};

/* -------------------------------------------------------------------------- */
/*  9. AMBIENCE — MUSIK LATAR & EFEK                                          */
/* -------------------------------------------------------------------------- */

export const ambienceConfig: AmbienceConfig = {
  backgroundMusicUrl: "/music/ambient-background.mp3", // ✏️
  backgroundMusicTitle: "Ambience — Buat Kita",
  backgroundMusicVolume: 0.35,
  enableFloatingHearts: true,
  enableTwinklingStars: true,
  enableCursorSparkle: true,
};

/* -------------------------------------------------------------------------- */
/*  10. META WEBSITE                                                          */
/* -------------------------------------------------------------------------- */

export const siteMeta: SiteMeta = {
  siteTitle: "A Little Surprise For You 💝", // ✏️
  siteDescription: "Sebuah kejutan kecil yang dibuat khusus untuk kamu.", // ✏️
  favicon: "💝",
};

/* -------------------------------------------------------------------------- */

const bucinData = {
  securityConfig,
  letterConfig,
  memoryGallery,
  galleryConfig,
  bouquetConfig,
  playlistConfig,
  hubConfig,
  qrConfig,
  themeConfig,
  ambienceConfig,
  siteMeta,
};

export default bucinData;
