"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { galleryConfig } from "@/config/bucinData";
import { burstAt } from "@/lib/confetti";
import { useLockBodyScroll, useReducedMotion } from "@/lib/hooks";
import { playPageTurn, playPop } from "@/lib/sound";

const items = galleryConfig.items;

export default function MemoryGallery() {
  const [active, setActive] = useState<number | null>(null);
  useLockBodyScroll(active !== null);

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(() => {
    setActive((i) => (i === null ? null : (i + 1) % items.length));
    playPageTurn();
  }, []);
  const prev = useCallback(() => {
    setActive((i) => (i === null ? null : (i - 1 + items.length) % items.length));
    playPageTurn();
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, next, prev]);

  return (
    <div className="w-full">
      <header className="mb-7 text-center">
        <h2 className="font-display text-[27px] text-gradient-pink sm:text-[36px]">
          {galleryConfig.title}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-white/55 sm:text-sm">
          {galleryConfig.subtitle}
        </p>
      </header>

      {/* Grid polaroid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07 } },
        }}
        className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
      >
        {items.map((item, i) => (
          <Polaroid key={item.id} index={i} onOpen={() => setActive(i)} {...item} />
        ))}
      </motion.div>

      {/* Timeline mini */}
      <div className="mt-10">
        <h3 className="mb-4 flex items-center justify-center gap-2 text-[12px] uppercase tracking-[0.22em] text-white/40">
          <span className="h-px w-8 bg-white/15" />
          Timeline Kita
          <span className="h-px w-8 bg-white/15" />
        </h3>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                playPop();
                setActive(i);
              }}
              className="glass group flex min-w-[168px] snap-start flex-col items-start gap-1.5 rounded-2xl p-3 text-left transition hover:border-blush/40 sm:min-w-[190px]"
            >
              <span className="flex items-center gap-1.5 text-[11px] text-gold">
                <Calendar className="h-3 w-3" />
                {item.date}
              </span>
              <span className="line-clamp-2 text-[12px] leading-snug text-white/70 transition group-hover:text-white">
                {item.caption}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <Lightbox index={active} onClose={close} onNext={next} onPrev={prev} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Polaroid card dengan tilt 3D                                              */
/* -------------------------------------------------------------------------- */

function Polaroid({
  imageUrl,
  caption,
  date,
  tilt = 0,
  index,
  onOpen,
}: {
  imageUrl: string;
  caption: string;
  date: string;
  tilt?: number;
  index: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tf, setTf] = useState("");
  const reduced = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTf(`rotateY(${px * 14}deg) rotateX(${-py * 14}deg) scale(1.045)`);
  };

  const onLeave = () => setTf("");

  return (
    <motion.button
      ref={ref}
      type="button"
      variants={{
        hidden: { opacity: 0, y: 26, rotate: tilt * 1.6 },
        show: { opacity: 1, y: 0, rotate: tilt },
      }}
      transition={{ type: "spring", stiffness: 190, damping: 20 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={(e) => {
        playPop();
        burstAt(e.clientX / window.innerWidth, e.clientY / window.innerHeight);
        onOpen();
      }}
      whileTap={{ scale: 0.96 }}
      className="perspective-1000 group relative block"
      aria-label={`Buka foto: ${caption}`}
    >
      <div
        className="preserve-3d rounded-[10px] bg-[#fdfaf5] p-2 pb-8 shadow-[0_16px_36px_-12px_rgba(0,0,0,0.75)] transition-transform duration-300 ease-out sm:p-2.5 sm:pb-10"
        style={{ transform: tf }}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-slate-800">
          <Image
            src={imageUrl}
            alt={caption}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.09]"
            priority={index < 4}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Heart className="h-3 w-3 fill-blush text-blush" />
            Lihat
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-1.5 px-3 text-center sm:bottom-2">
          <p className="truncate font-display text-[11px] text-slate-700 sm:text-[12.5px]">
            {caption}
          </p>
          <p className="text-[9px] text-slate-400 sm:text-[10px]">{date}</p>
        </div>
      </div>

      {/* Tape */}
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-3deg] rounded-[2px] bg-amber-100/25 backdrop-blur-sm"
      />
    </motion.button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Lightbox                                                                  */
/* -------------------------------------------------------------------------- */

function Lightbox({
  index,
  onClose,
  onNext,
  onPrev,
}: {
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const item = items[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 px-4 py-8 backdrop-blur-md"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Foto sebelumnya"
        className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-blush/45 sm:left-6"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Foto berikutnya"
        className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-blush/45 sm:right-6"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <AnimatePresence mode="wait">
        <motion.figure
          key={item.id}
          initial={{ opacity: 0, scale: 0.92, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-full w-full max-w-[440px] flex-col items-center"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_70px_-14px_rgba(244,114,182,0.55)]">
            <Image
              src={item.imageUrl}
              alt={item.caption}
              fill
              sizes="(max-width: 640px) 92vw, 440px"
              className="object-cover"
              priority
            />
          </div>
          <figcaption className="mt-4 text-center">
            <p className="font-display text-[16px] text-white sm:text-lg">{item.caption}</p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-[11.5px] text-gold">
              <Calendar className="h-3 w-3" />
              {item.date}
            </p>
            <p className="mt-2 text-[11px] text-white/35">
              {index + 1} dari {items.length}
            </p>
          </figcaption>
        </motion.figure>
      </AnimatePresence>
    </motion.div>
  );
}
