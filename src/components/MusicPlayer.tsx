"use client";

import { motion } from "framer-motion";
import {
  Disc3,
  Heart,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { playlistConfig } from "@/config/bucinData";
import { formatTime, useReducedMotion } from "@/lib/hooks";
import { playPop } from "@/lib/sound";

const songs =
  playlistConfig.playlist.length > 0
    ? playlistConfig.playlist
    : [playlistConfig.featuredSong];

const BAR_COUNT = 40;

interface MusicPlayerProps {
  /** Dipanggil supaya musik latar bisa di-pause saat lagu utama diputar. */
  onPlayStateChange?: (playing: boolean) => void;
}

export default function MusicPlayer({ onPlayStateChange }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [loop, setLoop] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [error, setError] = useState(false);

  const song = songs[index];
  const reduced = useReducedMotion();

  /* ----------------------------- Web Audio ----------------------------- */
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const [levels, setLevels] = useState<number[]>(() => new Array(BAR_COUNT).fill(0.08));
  const rafRef = useRef(0);

  const setupAnalyser = useCallback(() => {
    const el = audioRef.current;
    if (!el || srcRef.current) return;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      const source = ctx.createMediaElementSource(el);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      srcRef.current = source;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    } catch {
      // CORS atau browser tidak mendukung -> pakai visualizer simulasi
      analyserRef.current = null;
    }
  }, []);

  /* -------------------------- Loop visualizer -------------------------- */
  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      setLevels(new Array(BAR_COUNT).fill(0.08));
      return;
    }

    let t = 0;
    const tick = () => {
      const analyser = analyserRef.current;
      const data = dataRef.current;

      if (analyser && data) {
        analyser.getByteFrequencyData(data);
        const step = Math.max(1, Math.floor(data.length / BAR_COUNT));
        const next: number[] = [];
        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) sum += data[i * step + j] ?? 0;
          next.push(Math.max(0.06, sum / step / 255));
        }
        setLevels(next);
      } else {
        // Simulasi halus kalau analyser tidak tersedia
        t += 0.055;
        setLevels(
          Array.from({ length: BAR_COUNT }, (_, i) => {
            const v =
              0.34 +
              0.3 * Math.sin(t * 1.7 + i * 0.42) +
              0.2 * Math.sin(t * 2.9 + i * 0.19) +
              0.12 * Math.sin(t * 5.1 + i);
            return Math.min(1, Math.max(0.07, Math.abs(v)));
          }),
        );
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  useEffect(() => () => void ctxRef.current?.close().catch(() => {}), []);

  /* ------------------------------ Kontrol ------------------------------ */
  const togglePlay = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    setupAnalyser();
    if (ctxRef.current?.state === "suspended") await ctxRef.current.resume();

    if (el.paused) {
      try {
        await el.play();
        setPlaying(true);
        setError(false);
        onPlayStateChange?.(true);
      } catch {
        setError(true);
        setPlaying(false);
      }
    } else {
      el.pause();
      setPlaying(false);
      onPlayStateChange?.(false);
    }
  }, [onPlayStateChange, setupAnalyser]);

  const selectSong = useCallback(
    (i: number, autoPlay = true) => {
      playPop();
      setIndex(i);
      setCurrent(0);
      if (!autoPlay) return;
      window.setTimeout(() => {
        const el = audioRef.current;
        if (!el) return;
        setupAnalyser();
        void ctxRef.current?.resume();
        el.play()
          .then(() => {
            setPlaying(true);
            setError(false);
            onPlayStateChange?.(true);
          })
          .catch(() => {
            setError(true);
            setPlaying(false);
          });
      }, 90);
    },
    [onPlayStateChange, setupAnalyser],
  );

  const nextSong = useCallback(
    () => selectSong((index + 1) % songs.length),
    [index, selectSong],
  );
  const prevSong = useCallback(
    () => selectSong((index - 1 + songs.length) % songs.length),
    [index, selectSong],
  );

  /* ----------------------------- Sinkronisasi ----------------------------- */
  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = muted ? 0 : volume;
  }, [muted, volume]);

  const onTimeUpdate = () => {
    if (seeking) return;
    const el = audioRef.current;
    if (el) setCurrent(el.currentTime);
  };

  const onSeek = (value: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = value;
    setCurrent(value);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="w-full">
      <header className="mb-6 text-center">
        <h2 className="font-display text-[27px] text-gradient-pink sm:text-[36px]">
          {playlistConfig.title}
        </h2>
        <p className="mt-1.5 text-[12px] text-white/50 sm:text-[13px]">
          {playlistConfig.subtitle}
        </p>
      </header>

      <audio
        ref={audioRef}
        src={song.audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
        loop={loop}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={() => (loop ? undefined : nextSong())}
        onError={() => {
          setError(true);
          setPlaying(false);
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
        {/* ------------------------- Player utama ------------------------- */}
        <div className="glass relative overflow-hidden rounded-[26px] p-5 sm:p-7">
          {/* Cover blur di belakang */}
          <div aria-hidden className="absolute inset-0 -z-10 opacity-25">
            <Image
              src={song.coverUrl}
              alt=""
              fill
              sizes="600px"
              className="scale-125 object-cover blur-3xl"
            />
          </div>

          {/* Vinyl */}
          <div className="mb-5 flex justify-center">
            <div className="relative">
              <motion.div
                animate={playing && !reduced ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  playing && !reduced
                    ? { duration: 7, repeat: Infinity, ease: "linear" }
                    : { duration: 0.4 }
                }
                className="relative h-[188px] w-[188px] rounded-full sm:h-[218px] sm:w-[218px]"
                style={{
                  background:
                    "repeating-radial-gradient(circle at center, #0b1020 0 3px, #151b32 3px 6px)",
                  boxShadow:
                    "0 20px 50px -14px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.08)",
                }}
              >
                <div className="absolute inset-[19%] overflow-hidden rounded-full border-[3px] border-white/10 shadow-inner">
                  <Image
                    src={song.coverUrl}
                    alt={`Cover ${song.title}`}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
                <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-midnight" />
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 210deg, transparent 0deg, rgba(255,255,255,0.16) 30deg, transparent 70deg, transparent 200deg, rgba(255,255,255,0.1) 250deg, transparent 300deg)",
                  }}
                />
              </motion.div>

              {/* Tonearm */}
              <motion.div
                animate={{ rotate: playing ? 16 : -8 }}
                transition={{ type: "spring", stiffness: 90, damping: 15 }}
                className="absolute -right-3 -top-3 h-24 w-24 origin-top-right sm:-right-4 sm:h-28 sm:w-28"
              >
                <div className="absolute right-2 top-2 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-slate-300 to-slate-600 shadow" />
                <div className="absolute right-[13px] top-[13px] h-[76px] w-1 origin-top rotate-[28deg] rounded-full bg-gradient-to-b from-slate-300 to-slate-500 sm:h-[92px]" />
              </motion.div>

              {playing && (
                <motion.span
                  aria-hidden
                  animate={{ scale: [1, 1.13, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="absolute inset-0 -z-10 rounded-full bg-blush/35 blur-2xl"
                />
              )}
            </div>
          </div>

          {/* Judul */}
          <div className="mb-4 text-center">
            <h3 className="font-display text-[20px] text-white sm:text-[23px]">
              {song.title}
            </h3>
            <p className="text-[12.5px] text-blush/85">{song.artist}</p>
            {song.dedication && (
              <p className="mx-auto mt-2 max-w-[19rem] text-[11.5px] italic leading-relaxed text-white/45">
                “{song.dedication}”
              </p>
            )}
          </div>

          {/* Visualizer */}
          <div className="mb-4 flex h-14 items-end justify-center gap-[3px] px-1">
            {levels.map((v, i) => (
              <motion.span
                key={i}
                animate={{ height: `${Math.max(6, v * 100)}%` }}
                transition={{ duration: 0.09, ease: "linear" }}
                className="w-full max-w-[6px] flex-1 rounded-full"
                style={{
                  background: `linear-gradient(to top, #fb7185, #f472b6 55%, ${
                    v > 0.72 ? "#fcd34d" : "#f9a8d4"
                  })`,
                  opacity: playing ? 0.95 : 0.32,
                }}
              />
            ))}
          </div>

          {/* Seekbar */}
          <div className="mb-3">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/12">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blush to-gold"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(244,114,182,0.9)]"
                style={{ left: `${progress}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={current}
                aria-label="Posisi lagu"
                onMouseDown={() => setSeeking(true)}
                onTouchStart={() => setSeeking(true)}
                onMouseUp={() => setSeeking(false)}
                onTouchEnd={() => setSeeking(false)}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10.5px] tabular-nums text-white/45">
              <span>{formatTime(current)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Tombol kontrol */}
          <div className="flex items-center justify-center gap-4 sm:gap-5">
            <button
              type="button"
              onClick={prevSong}
              aria-label="Lagu sebelumnya"
              className="touch-target grid place-items-center rounded-full p-2 text-white/65 transition hover:text-blush active:scale-90"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>

            <motion.button
              type="button"
              onClick={togglePlay}
              whileTap={{ scale: 0.92 }}
              aria-label={playing ? "Jeda" : "Putar"}
              className="grid h-[58px] w-[58px] place-items-center rounded-full bg-gradient-to-br from-blush to-rose text-white shadow-[0_10px_30px_-6px_rgba(244,114,182,0.85)] sm:h-[64px] sm:w-[64px]"
            >
              {playing ? (
                <Pause className="h-6 w-6 fill-current" />
              ) : (
                <Play className="ml-0.5 h-6 w-6 fill-current" />
              )}
            </motion.button>

            <button
              type="button"
              onClick={nextSong}
              aria-label="Lagu berikutnya"
              className="touch-target grid place-items-center rounded-full p-2 text-white/65 transition hover:text-blush active:scale-90"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
          </div>

          {/* Volume & loop */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? "Nyalakan suara" : "Bisukan"}
              className="text-white/55 transition hover:text-blush"
            >
              {muted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/12">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white/55"
                style={{ width: `${(muted ? 0 : volume) * 100}%` }}
              />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                aria-label="Volume"
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  setMuted(false);
                }}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>

            <button
              type="button"
              onClick={() => setLoop((l) => !l)}
              aria-label="Ulangi lagu"
              className={`transition ${loop ? "text-gold" : "text-white/40 hover:text-white/70"}`}
            >
              <Repeat className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-rose-500/12 px-3 py-2 text-center text-[11px] text-rose-200">
              Audio tidak bisa diputar. Cek <code>audioUrl</code> di bucinData.ts
              (harus link file .mp3 langsung).
            </p>
          )}
        </div>

        {/* --------------------------- Playlist --------------------------- */}
        <div className="glass rounded-[26px] p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 px-1">
            <Disc3 className="h-4 w-4 text-blush" />
            <h3 className="text-[13px] font-medium uppercase tracking-[0.16em] text-white/65">
              Playlist
            </h3>
            <span className="ml-auto text-[11px] text-white/35">{songs.length} lagu</span>
          </div>

          <ul className="flex max-h-[440px] flex-col gap-2 overflow-y-auto pr-1">
            {songs.map((s, i) => {
              const isActive = i === index;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => (isActive ? void togglePlay() : selectSong(i))}
                    className={`group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition ${
                      isActive
                        ? "bg-gradient-to-r from-blush/22 to-transparent ring-1 ring-blush/35"
                        : "hover:bg-white/[0.055]"
                    }`}
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={s.coverUrl}
                        alt={s.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                      <span
                        className={`absolute inset-0 grid place-items-center bg-black/55 transition-opacity ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isActive && playing ? (
                          <Pause className="h-4 w-4 fill-white text-white" />
                        ) : (
                          <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
                        )}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-[13.5px] ${
                          isActive ? "text-blush" : "text-white/85"
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="truncate text-[11px] text-white/40">{s.artist}</p>
                    </div>

                    {isActive && playing && (
                      <span className="flex h-4 items-end gap-[2px]">
                        {[0, 1, 2].map((b) => (
                          <motion.span
                            key={b}
                            animate={{ height: ["25%", "100%", "45%", "80%", "30%"] }}
                            transition={{
                              duration: 1.05,
                              repeat: Infinity,
                              delay: b * 0.16,
                            }}
                            className="w-[3px] rounded-full bg-blush"
                          />
                        ))}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/[0.04] p-3 text-[11px] leading-relaxed text-white/45">
            <Heart className="h-3.5 w-3.5 shrink-0 fill-rose/60 text-rose/60" />
            Ganti lagu lewat <code className="text-blush/80">playlistConfig</code> di{" "}
            <code className="text-blush/80">src/config/bucinData.ts</code>.
          </div>
        </div>
      </div>
    </div>
  );
}
