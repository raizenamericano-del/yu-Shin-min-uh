"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Flower2, Heart, Images, Music4, Sparkles } from "lucide-react";
import { useState } from "react";
import { hubConfig, letterConfig } from "@/config/bucinData";
import { goldShower, heartRain } from "@/lib/confetti";
import { useHaptic } from "@/lib/hooks";
import { playChime, playPop } from "@/lib/sound";
import MemoryGallery from "./MemoryGallery";
import MusicPlayer from "./MusicPlayer";
import VirtualBouquet from "./VirtualBouquet";

type GiftKey = "memories" | "bouquet" | "playlist";

interface GiftHubProps {
  onRestart: () => void;
  onSongPlayStateChange?: (playing: boolean) => void;
}

const GIFTS: Array<{
  key: GiftKey;
  icon: typeof Images;
  gradient: string;
  glow: string;
  emoji: string;
}> = [
  {
    key: "memories",
    icon: Images,
    gradient: "from-pink-500/22 via-rose-500/12 to-transparent",
    glow: "rgba(244,114,182,0.55)",
    emoji: "📸",
  },
  {
    key: "bouquet",
    icon: Flower2,
    gradient: "from-rose-500/22 via-fuchsia-500/12 to-transparent",
    glow: "rgba(251,113,133,0.55)",
    emoji: "🌸",
  },
  {
    key: "playlist",
    icon: Music4,
    gradient: "from-amber-400/20 via-pink-500/12 to-transparent",
    glow: "rgba(252,211,77,0.5)",
    emoji: "🎵",
  },
];

export default function GiftHub({ onRestart, onSongPlayStateChange }: GiftHubProps) {
  const [active, setActive] = useState<GiftKey | null>(null);
  const [opened, setOpened] = useState<Set<GiftKey>>(new Set());
  const [finale, setFinale] = useState(false);
  const haptic = useHaptic();

  const openGift = (key: GiftKey) => {
    playChime();
    haptic([10, 30, 10]);
    setActive(key);
    setOpened((prev) => {
      const next = new Set(prev);
      next.add(key);
      if (next.size === 3) {
        window.setTimeout(() => {
          setFinale(true);
          goldShower();
        }, 900);
      }
      return next;
    });
  };

  const back = () => {
    playPop();
    setActive(null);
  };

  return (
    <motion.section
      key="hub"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 min-h-[100dvh] w-full px-4 py-10 safe-bottom sm:px-6 sm:py-14"
    >
      <div className="mx-auto w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {active === null ? (
            /* ---------------------------- DASHBOARD ---------------------------- */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4 }}
            >
              <header className="mb-9 text-center sm:mb-12">
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-1.5 text-[12px] uppercase tracking-[0.3em] text-white/40"
                >
                  {hubConfig.greeting} {letterConfig.recipientName}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="font-display text-[32px] leading-tight text-gradient-pink sm:text-[48px]"
                >
                  {hubConfig.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto mt-2.5 max-w-md text-[13px] leading-relaxed text-white/55 sm:text-sm"
                >
                  {hubConfig.subtitle}
                </motion.p>
              </header>

              <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
                {GIFTS.map((gift, i) => {
                  const meta = hubConfig.cards[gift.key];
                  const Icon = gift.icon;
                  const isOpened = opened.has(gift.key);

                  return (
                    <motion.button
                      key={gift.key}
                      type="button"
                      onClick={() => openGift(gift.key)}
                      initial={{ opacity: 0, y: 34 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.28 + i * 0.11,
                        type: "spring",
                        stiffness: 160,
                        damping: 18,
                      }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="group relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.045] p-6 text-left backdrop-blur-xl transition-colors hover:border-white/25 sm:p-7"
                    >
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gift.gradient} opacity-70 transition-opacity group-hover:opacity-100`}
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                        style={{ background: gift.glow }}
                      />

                      <div className="relative">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/60">
                            {meta.badge}
                          </span>
                        </div>

                        <h3 className="font-display text-[20px] text-white sm:text-[22px]">
                          {meta.title}
                        </h3>
                        <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/55">
                          {meta.description}
                        </p>

                        <div className="mt-5 flex items-center gap-1.5 text-[12px] font-medium text-blush">
                          <span>{isOpened ? "Buka lagi" : "Buka hadiah"}</span>
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </div>
                      </div>

                      {/* Emoji besar dekoratif */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-3 right-4 text-[42px] opacity-15 transition-all duration-500 group-hover:scale-125 group-hover:opacity-30"
                      >
                        {gift.emoji}
                      </span>

                      {isOpened && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-emerald-400/25 text-emerald-300"
                        >
                          <Heart className="h-3 w-3 fill-current" />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Progress */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-9 flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2">
                  {GIFTS.map((g) => (
                    <span
                      key={g.key}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        opened.has(g.key) ? "w-8 bg-blush" : "w-4 bg-white/15"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11.5px] text-white/35">
                  {opened.size} dari 3 hadiah sudah dibuka
                </p>
              </motion.div>
            </motion.div>
          ) : (
            /* ------------------------------ DETAIL ------------------------------ */
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 26, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={back}
                className="mb-6 flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[12.5px] text-white/70 transition hover:border-blush/40 hover:text-blush"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke hadiah
              </button>

              {active === "memories" && <MemoryGallery />}
              {active === "bouquet" && <VirtualBouquet />}
              {active === "playlist" && (
                <MusicPlayer onPlayStateChange={onSongPlayStateChange} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Finale */}
      <AnimatePresence>
        {finale && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-black/80 px-5 backdrop-blur-md"
            onClick={() => setFinale(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong w-full max-w-sm rounded-[28px] px-6 py-8 text-center shadow-2xl"
            >
              <motion.div
                animate={{ scale: [1, 1.16, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blush to-rose"
              >
                <Heart className="h-8 w-8 fill-white text-white" />
              </motion.div>

              <h3 className="font-display text-[22px] text-gradient-gold">
                {hubConfig.finaleTitle}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-white/65">
                {hubConfig.finaleMessage}
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    heartRain(1800);
                    setFinale(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blush to-rose px-5 py-3 text-[13px] font-medium text-white"
                >
                  <Sparkles className="h-4 w-4" />
                  Lanjut lihat-lihat
                </button>
                <button
                  type="button"
                  onClick={onRestart}
                  className="rounded-full border border-white/12 px-5 py-2.5 text-[12.5px] text-white/55 transition hover:text-white"
                >
                  {hubConfig.finaleButton}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
