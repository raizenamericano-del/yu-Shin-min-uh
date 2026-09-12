"use client";

import { Check, Copy, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { qrConfig } from "@/config/bucinData";

/**
 * QrShare — membuat QR code dari URL halaman ini (atau qrConfig.targetUrl).
 * QR di-generate di browser sebagai data URL, jadi tidak butuh layanan luar.
 */
export default function QrShare() {
  const [dataUrl, setDataUrl] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const target = qrConfig.targetUrl || window.location.origin + window.location.pathname;
    setUrl(target);

    void QRCode.toDataURL(target, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 520,
      color: { dark: "#1e1b4b", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => setDataUrl(""));
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* diabaikan */
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex items-center gap-2 text-blush">
        <QrCode className="h-4 w-4" />
        <h3 className="font-display text-lg">{qrConfig.title}</h3>
      </div>

      <div className="relative rounded-2xl bg-white p-3 shadow-[0_0_44px_-8px_rgba(244,114,182,0.7)]">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dataUrl}
            alt="QR code menuju halaman kejutan"
            className="h-[190px] w-[190px] rounded-lg sm:h-[210px] sm:w-[210px]"
          />
        ) : (
          <div className="grid h-[190px] w-[190px] animate-pulse place-items-center rounded-lg bg-slate-200 text-xs text-slate-500 sm:h-[210px] sm:w-[210px]">
            Membuat QR…
          </div>
        )}
        <span className="pointer-events-none absolute -right-1.5 -top-1.5 text-lg">💝</span>
      </div>

      <p className="mt-3.5 max-w-[15rem] text-[12px] leading-relaxed text-white/55">
        {qrConfig.description}
      </p>

      <button
        type="button"
        onClick={copy}
        className="mt-3.5 flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-[11px] text-white/65 transition hover:border-blush/40 hover:text-blush"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Link tersalin!" : "Salin link"}
      </button>
    </div>
  );
}
