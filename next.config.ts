import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `standalone` menghasilkan folder .next/standalone berisi server minimal.
   * Ini yang dipakai Dockerfile agar image kecil & cepat saat deploy ke Railway.
   */
  output: "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    /**
     * Gambar bawaan template disimpan lokal di /public/photos.
     * Kalau kamu mau pakai URL luar (Unsplash / Cloudinary / Google Drive dsb),
     * tambahkan host-nya di sini supaya <Image /> Next.js mengizinkannya.
     */
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.ibb.co" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
    ],
  },
};

export default nextConfig;
