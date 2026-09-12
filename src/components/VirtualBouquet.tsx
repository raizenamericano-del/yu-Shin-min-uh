"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flower2, Heart, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { bouquetConfig } from "@/config/bucinData";
import { useReducedMotion } from "@/lib/hooks";
import { playBloom, playPop } from "@/lib/sound";

/* -------------------------------------------------------------------------- */

interface Stem {
  id: number;
  angle: number;
  length: number;
  scale: number;
  delay: number;
  color: string;
  petals: number;
}

export default function VirtualBouquet() {
  const [bloomKey, setBloomKey] = useState(0);
  const [quote, setQuote] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    playBloom();
  }, [bloomKey]);

  useEffect(() => {
    if (bouquetConfig.quotes.length < 2) return;
    const t = window.setInterval(
      () => setQuote((q) => (q + 1) % bouquetConfig.quotes.length),
      5200,
    );
    return () => window.clearInterval(t);
  }, []);

  const stems = useMemo<Stem[]>(() => {
    const n = Math.max(3, Math.min(14, bouquetConfig.flowerCount));
    const spread = 128;
    return Array.from({ length: n }, (_, i) => {
      const ratio = n === 1 ? 0.5 : i / (n - 1);
      const angle = -spread / 2 + ratio * spread;
      const edge = Math.abs(ratio - 0.5) * 2; // 0 = tengah, 1 = pinggir
      return {
        id: i,
        angle,
        length: 148 - edge * 34,
        scale: 1.06 - edge * 0.26,
        delay: 0.25 + Math.abs(i - (n - 1) / 2) * 0.11,
        color:
          i % 3 === 0
            ? bouquetConfig.flowerColorSecondary
            : i % 3 === 1
              ? bouquetConfig.flowerColor
              : "#fbcfe8",
        petals: i % 2 === 0 ? 6 : 8,
      };
    });
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Petals jatuh */}
      {!reduced && <FallingPetals />}

      <header className="relative z-10 mb-6 text-center">
        <h2 className="font-display text-[27px] text-gradient-pink sm:text-[36px]">
          {bouquetConfig.title}
        </h2>
        <p className="mt-1.5 text-[12px] text-white/45 sm:text-[13px]">
          {bouquetConfig.signature}
        </p>
      </header>

      <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Buket */}
        <div className="relative mx-auto flex h-[330px] w-full max-w-[330px] items-end justify-center sm:h-[400px] sm:max-w-[400px]">
          {/* Glow */}
          <div className="absolute bottom-10 h-52 w-52 rounded-full bg-blush/22 blur-[70px] sm:h-64 sm:w-64" />

          <svg
            key={bloomKey}
            viewBox="0 0 320 400"
            className="relative h-full w-full drop-shadow-[0_18px_34px_rgba(0,0,0,0.55)]"
            aria-label="Buket bunga virtual"
            role="img"
          >
            <defs>
              <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#15803d" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="wrapGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fde8ef" />
                <stop offset="55%" stopColor="#f9c8dc" />
                <stop offset="100%" stopColor="#e9a3c1" />
              </linearGradient>
              <radialGradient id="centerGrad">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="100%" stopColor={bouquetConfig.flowerCenterColor} />
              </radialGradient>
            </defs>

            {/* Tangkai + bunga */}
            {stems.map((s) => {
              const rad = (s.angle * Math.PI) / 180;
              const baseX = 160;
              const baseY = 320;
              const tipX = baseX + Math.sin(rad) * s.length;
              const tipY = baseY - Math.cos(rad) * s.length;
              const ctrlX = baseX + Math.sin(rad) * s.length * 0.42;
              const ctrlY = baseY - Math.cos(rad) * s.length * 0.72;

              return (
                <g key={s.id}>
                  <motion.path
                    d={`M ${baseX} ${baseY} Q ${ctrlX} ${ctrlY} ${tipX} ${tipY}`}
                    stroke="url(#stemGrad)"
                    strokeWidth={3.4}
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.85, delay: s.delay, ease: "easeOut" }}
                  />
                  {/* Daun */}
                  <motion.ellipse
                    cx={ctrlX + (s.angle > 0 ? 9 : -9)}
                    cy={ctrlY + 26}
                    rx={11}
                    ry={5.2}
                    fill="#22c55e"
                    opacity={0.75}
                    transform={`rotate(${s.angle * 0.6}, ${ctrlX}, ${ctrlY + 26})`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.75 }}
                    transition={{ delay: s.delay + 0.45, type: "spring", stiffness: 220 }}
                    style={{ transformOrigin: `${ctrlX}px ${ctrlY + 26}px` }}
                  />
                  <Flower cx={tipX} cy={tipY} stem={s} />
                </g>
              );
            })}

            {/* Pembungkus buket */}
            <motion.path
              d="M 108 312 L 160 396 L 212 312 Q 160 340 108 312 Z"
              fill="url(#wrapGrad)"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.55, ease: "easeOut" }}
              style={{ transformOrigin: "160px 312px" }}
            />
            <motion.path
              d="M 108 312 Q 160 296 212 312 L 196 330 Q 160 318 124 330 Z"
              fill="#fff1f6"
              opacity={0.65}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              transition={{ delay: 0.3 }}
            />
            {/* Pita */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.75, type: "spring", stiffness: 220, damping: 14 }}
              style={{ transformOrigin: "160px 344px" }}
            >
              <rect x="122" y="336" width="76" height="12" rx="6" fill={bouquetConfig.flowerColorSecondary} />
              <path d="M 160 342 L 138 328 L 142 352 Z" fill="#f43f5e" />
              <path d="M 160 342 L 182 328 L 178 352 Z" fill="#f43f5e" />
              <circle cx="160" cy="342" r="6" fill={bouquetConfig.flowerCenterColor} />
            </motion.g>
          </svg>

          {/* Tombol mekar ulang */}
          <button
            type="button"
            onClick={() => {
              playPop();
              setBloomKey((k) => k + 1);
            }}
            className="absolute bottom-0 right-0 flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[11px] text-white/60 backdrop-blur transition hover:border-blush/40 hover:text-blush"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Mekar lagi
          </button>
        </div>

        {/* Pesan */}
        <motion.div
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative rounded-[24px] p-6 sm:p-7"
        >
          <Flower2 className="mb-3 h-6 w-6 text-blush" />
          <p className="text-[14px] leading-[1.9] text-white/80 sm:text-[15px]">
            {bouquetConfig.message}
          </p>

          <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent" />

          <div className="relative mt-4 h-12">
            <AnimatePresence mode="wait">
              <motion.p
                key={quote}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 flex items-center font-display text-[15px] italic text-gradient-gold sm:text-base"
              >
                “{bouquetConfig.quotes[quote]}”
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            {bouquetConfig.quotes.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === quote ? "w-5 bg-gold" : "w-1 bg-white/20"
                }`}
              />
            ))}
          </div>

          <Heart
            aria-hidden
            className="absolute -right-2 -top-2 h-8 w-8 fill-rose/25 text-rose/40 animate-heartbeat"
          />
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Satu kuntum bunga SVG                                                     */
/* -------------------------------------------------------------------------- */

function Flower({ cx, cy, stem }: { cx: number; cy: number; stem: Stem }) {
  const petals = Array.from({ length: stem.petals }, (_, i) => (i * 360) / stem.petals);

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0, rotate: -35 }}
      animate={{ scale: stem.scale, opacity: 1, rotate: 0 }}
      transition={{
        delay: stem.delay + 0.6,
        type: "spring",
        stiffness: 170,
        damping: 13,
      }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <motion.g
        animate={{ rotate: [0, 4, -4, 0] }}
        transition={{ duration: 6 + stem.id * 0.35, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {petals.map((deg) => (
          <ellipse
            key={deg}
            cx={cx}
            cy={cy - 13}
            rx={7.6}
            ry={14}
            fill={stem.color}
            opacity={0.94}
            transform={`rotate(${deg}, ${cx}, ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r={6.4} fill="url(#centerGrad)" />
        <circle cx={cx - 1.6} cy={cy - 1.6} r={2} fill="#fffbeb" opacity={0.85} />
      </motion.g>
    </motion.g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Kelopak jatuh                                                             */
/* -------------------------------------------------------------------------- */

function FallingPetals() {
  const petals = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 8 + Math.random() * 12,
        duration: 9 + Math.random() * 9,
        delay: Math.random() * 9,
        sway: 26 + Math.random() * 54,
        color: [
          bouquetConfig.flowerColor,
          bouquetConfig.flowerColorSecondary,
          "#fbcfe8",
          "#fda4af",
        ][i % 4],
        rotate: Math.random() * 360,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-12%", x: 0, rotate: p.rotate, opacity: 0 }}
          animate={{
            y: "115%",
            x: [0, p.sway, -p.sway * 0.6, 0],
            rotate: p.rotate + 320,
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.35,
            background: p.color,
            borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%",
            filter: "blur(0.3px)",
          }}
        />
      ))}
    </div>
  );
}
