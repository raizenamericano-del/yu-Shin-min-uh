"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Music2, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { ambienceConfig } from "@/config/bucinData";

export interface BackgroundMusicHandle {
  play: () => void;
  pause: () => void;
  duck: (quiet: boolean) => void;
}

interface Props {
  ref?: React.Ref<BackgroundMusicHandle>;
  /** Widget hanya muncul setelah stage tertentu. */
  visible?: boolean;
}

/**
 * Widget musik latar mengambang.
 * Audio element hidup di root layout page sehingga TIDAK ikut unmount
 * saat berpindah stage — musik tetap jalan mulus.
 */
export default function BackgroundMusic({ ref, visible = true }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(ambienceConfig.backgroundMusicVolume);
  const duckedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    play: () => {
      const el = audioRef.current;
      if (!el) return;
      el.volume = volume;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    },
    pause: () => {
      audioRef.current?.pause();
      setPlaying(false);
    },
    duck: (quiet: boolean) => {
      duckedRef.current = quiet;
      const el = audioRef.current;
      if (el) el.volume = quiet ? volume * 0.16 : volume;
    },
  }));

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = duckedRef.current ? volume * 0.16 : volume;
  }, [volume]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={ambienceConfig.backgroundMusicUrl}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="fixed bottom-4 left-4 z-[60] safe-bottom sm:bottom-5 sm:left-5"
          >
            <motion.div
              layout
              className="glass-strong flex items-center gap-2 rounded-full p-1.5 shadow-[0_10px_34px_-10px_rgba(0,0,0,0.8)]"
            >
              <button
                type="button"
                onClick={toggle}
                aria-label={playing ? "Jeda musik latar" : "Putar musik latar"}
                className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush to-rose text-white"
              >
                {playing ? (
                  <Pause className="h-4 w-4 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                )}
                {playing && (
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-blush/50" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                aria-label="Pengaturan musik latar"
                className="grid h-8 w-8 place-items-center rounded-full text-white/55 transition hover:text-blush"
              >
                <motion.span
                  animate={playing ? { rotate: 360 } : {}}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                >
                  <Music2 className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="flex items-center gap-2 overflow-hidden pr-3"
                  >
                    <Volume2 className="h-3.5 w-3.5 shrink-0 text-white/50" />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      aria-label="Volume musik latar"
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 accent-pink-400"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {expanded && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1.5 max-w-[180px] truncate pl-2 text-[10.5px] text-white/40"
                >
                  {ambienceConfig.backgroundMusicTitle}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
