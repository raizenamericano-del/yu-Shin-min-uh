"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Gift, Heart, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { letterConfig } from "@/config/bucinData";
import { heartRain } from "@/lib/confetti";
import { useHaptic, useReducedMotion } from "@/lib/hooks";
import { playChime, playOpen, playPageTurn } from "@/lib/sound";

interface LetterModalProps {
  onFinish: () => void;
}

const TOTAL = letterConfig.pages.length;

export default function LetterModal({ onFinish }: LetterModalProps) {
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const haptic = useHaptic();
  const reduced = useReducedMotion();

  const openEnvelope = () => {
    if (opened) return;
    setOpened(true);
    playOpen();
    haptic([14, 40, 14]);
    heartRain(2200);
    window.setTimeout(playChime, 700);
  };

  const goNext = useCallback(() => {
    if (page >= TOTAL - 1) return;
    setDir(1);
    setPage((p) => p + 1);
    playPageTurn();
    haptic(9);
  }, [haptic, page]);

  const goPrev = useCallback(() => {
    if (page <= 0) return;
    setDir(-1);
    setPage((p) => p - 1);
    playPageTurn();
    haptic(9);
  }, [haptic, page]);

  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, opened]);

  const isLast = page === TOTAL - 1;

  return (
    <motion.section
      key="letter"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-4 py-12 safe-bottom sm:px-6"
    >
      <AnimatePresence mode="wait">
        {!opened ? (
          /* ----------------------------- AMPLOP ----------------------------- */
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col items-center"
          >
            <motion.p
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-7 text-center font-display text-[22px] text-gradient-pink sm:text-3xl"
            >
              Untuk {letterConfig.recipientName}
            </motion.p>

            <motion.button
              type="button"
              onClick={openEnvelope}
              aria-label="Buka amplop surat"
              initial={{ opacity: 0, y: 40, rotateX: -18 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ type: "spring", stiffness: 170, damping: 18, delay: 0.1 }}
              whileHover={reduced ? undefined : { scale: 1.035, rotateX: 6, rotateY: -4 }}
              whileTap={{ scale: 0.97 }}
              className="perspective-1000 group relative block w-[min(92vw,400px)] cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Envelope />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center gap-2 text-[12px] text-white/45 sm:text-[13px]"
            >
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-4 w-4 text-gold" />
              </motion.span>
              {letterConfig.envelopeHint}
            </motion.div>
          </motion.div>
        ) : (
          /* ------------------------------ SURAT ------------------------------ */
          <motion.div
            key="paper"
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 130, damping: 18, delay: 0.15 }}
            className="w-full max-w-[560px]"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 fill-blush text-blush" />
                <span className="font-display text-base text-gradient-pink sm:text-lg">
                  {letterConfig.title}
                </span>
              </div>
              <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[11px] tabular-nums text-white/55">
                {page + 1} / {TOTAL}
              </span>
            </div>

            {/* Kertas */}
            <div className="perspective-1600 relative min-h-[380px] sm:min-h-[420px]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.article
                  key={page}
                  custom={dir}
                  initial={{
                    rotateY: dir === 1 ? 74 : -74,
                    opacity: 0,
                    x: dir === 1 ? 40 : -40,
                  }}
                  animate={{ rotateY: 0, opacity: 1, x: 0 }}
                  exit={{
                    rotateY: dir === 1 ? -74 : 74,
                    opacity: 0,
                    x: dir === 1 ? -40 : 40,
                  }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.16}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) goNext();
                    else if (info.offset.x > 70) goPrev();
                  }}
                  style={{
                    transformOrigin: dir === 1 ? "left center" : "right center",
                    touchAction: "pan-y",
                  }}
                  className="paper-texture preserve-3d relative min-h-[380px] rounded-[20px] px-6 py-8 shadow-[0_28px_70px_-18px_rgba(0,0,0,0.75)] sm:min-h-[420px] sm:px-9 sm:py-10"
                >
                  {/* Garis lipatan */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-8 w-px bg-rose-300/35 sm:left-12"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[20px] shadow-[inset_0_0_60px_rgba(190,120,140,0.13)]"
                  />

                  {page === 0 && (
                    <p className="mb-4 font-display text-[19px] text-rose-600 sm:text-[22px]">
                      Dear {letterConfig.recipientName},
                    </p>
                  )}

                  <p className="whitespace-pre-line text-[14.5px] leading-[1.95] text-slate-700 sm:text-[15.5px] sm:leading-[2.05]">
                    {letterConfig.pages[page]}
                  </p>

                  {isLast && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 text-right"
                    >
                      <p className="text-[13px] italic text-slate-500">
                        {letterConfig.closingNote}
                      </p>
                      <p className="mt-1 font-display text-[19px] text-rose-600">
                        {letterConfig.senderName}
                      </p>
                    </motion.div>
                  )}

                  <Heart
                    aria-hidden
                    className="absolute bottom-5 right-6 h-5 w-5 fill-rose-300/45 text-rose-300/45"
                  />
                </motion.article>
              </AnimatePresence>
            </div>

            {/* Kontrol */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={page === 0}
                className="touch-target flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2.5 text-[13px] text-white/75 transition enabled:hover:border-blush/40 enabled:hover:text-blush disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
                Kembali
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {letterConfig.pages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Ke halaman ${i + 1}`}
                    onClick={() => {
                      if (i === page) return;
                      setDir(i > page ? 1 : -1);
                      setPage(i);
                      playPageTurn();
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      i === page ? "w-6 bg-blush" : "w-1.5 bg-white/25 hover:bg-white/45"
                    }`}
                  />
                ))}
              </div>

              {isLast ? (
                <motion.button
                  type="button"
                  onClick={() => {
                    playChime();
                    haptic([12, 40, 12]);
                    onFinish();
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(244,114,182,0)",
                      "0 0 28px rgba(244,114,182,0.6)",
                      "0 0 0 rgba(244,114,182,0)",
                    ],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="touch-target flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blush to-rose px-4 py-2.5 text-[13px] font-medium text-white sm:px-5"
                >
                  <Gift className="h-4 w-4" />
                  Hadiah
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="touch-target flex items-center gap-1 rounded-full border border-blush/35 bg-blush/12 px-4 py-2.5 text-[13px] text-blush transition hover:bg-blush/22"
                >
                  Lanjut
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

            <p className="mt-4 text-center text-[11px] text-white/30">
              Geser / gunakan tombol panah ⟵ ⟶
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Amplop 3D dengan wax seal                                                 */
/* -------------------------------------------------------------------------- */

function Envelope() {
  return (
    <div className="relative aspect-[1.55/1] w-full">
      {/* Body amplop */}
      <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-gradient-to-br from-[#fde8ef] via-[#fbd5e3] to-[#f6bcd2] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.7)]">
        {/* Segitiga bawah */}
        <div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{
            background: "linear-gradient(160deg,#fbcfe0 0%,#f3aec9 100%)",
            clipPath: "polygon(0 100%, 50% 42%, 100% 100%)",
          }}
        />
        {/* Sayap kiri & kanan */}
        <div
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            background: "linear-gradient(90deg,rgba(255,255,255,0.42),transparent)",
            clipPath: "polygon(0 0, 0 100%, 62% 50%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{
            background: "linear-gradient(270deg,rgba(255,255,255,0.32),transparent)",
            clipPath: "polygon(100% 0, 100% 100%, 38% 50%)",
          }}
        />
        {/* Kilau */}
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_38%,rgba(255,255,255,0.55)_50%,transparent_62%)]" />
      </div>

      {/* Flap atas */}
      <div
        className="absolute inset-x-0 top-0 h-[58%] origin-top"
        style={{
          background: "linear-gradient(180deg,#f9c8dc 0%,#efa6c4 100%)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          filter: "drop-shadow(0 6px 10px rgba(120,40,70,0.25))",
        }}
      />

      {/* Wax seal */}
      <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          className="relative grid h-[62px] w-[62px] place-items-center rounded-full shadow-[0_8px_20px_-4px_rgba(120,20,50,0.65)] sm:h-[70px] sm:w-[70px]"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, #fb7185 0%, #e11d48 45%, #9f1239 100%)",
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 rounded-full opacity-60"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.16) 0deg 9deg, transparent 9deg 18deg)",
            }}
          />
          <Heart className="relative h-7 w-7 fill-rose-100/95 text-rose-100/95 drop-shadow sm:h-8 sm:w-8" />
        </motion.div>
        <span
          aria-hidden
          className="absolute inset-0 -z-10 animate-pulse-ring rounded-full bg-rose/45"
        />
      </div>

      {/* Bayangan bawah */}
      <div
        aria-hidden
        className="absolute -bottom-5 left-1/2 h-6 w-[78%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-xl"
      />
    </div>
  );
}
