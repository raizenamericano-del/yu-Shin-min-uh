"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Delete, Heart, HelpCircle, Lock, QrCode, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { qrConfig, securityConfig } from "@/config/bucinData";
import { loveExplosion } from "@/lib/confetti";
import { useHaptic } from "@/lib/hooks";
import { playError, playKeyTap, playPop, playSuccess } from "@/lib/sound";
import QrShare from "./QrShare";

const PIN_LENGTH = securityConfig.pinCode.length;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const haptic = useHaptic();

  const submit = useCallback(
    (value: string) => {
      if (value === securityConfig.pinCode) {
        setStatus("success");
        playSuccess();
        haptic([18, 60, 18, 60, 40]);
        loveExplosion();
        window.setTimeout(onUnlock, 1500);
      } else {
        setStatus("error");
        playError();
        haptic([40, 60, 40]);
        setAttempts((a) => {
          const next = a + 1;
          if (next >= securityConfig.maxAttemptsBeforeHint) setShowHint(true);
          return next;
        });
        window.setTimeout(() => {
          setPin("");
          setStatus("idle");
        }, 900);
      }
    },
    [haptic, onUnlock],
  );

  const pressKey = useCallback(
    (key: string) => {
      if (status !== "idle" || pin.length >= PIN_LENGTH) return;
      playKeyTap(Number(key));
      haptic(10);
      const next = pin + key;
      setPin(next);
      if (next.length === PIN_LENGTH) window.setTimeout(() => submit(next), 220);
    },
    [haptic, pin, status, submit],
  );

  const backspace = useCallback(() => {
    if (status !== "idle" || pin.length === 0) return;
    playPop();
    haptic(8);
    setPin((p) => p.slice(0, -1));
  }, [haptic, pin.length, status]);

  // Dukungan keyboard fisik (desktop)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showQr) return;
      if (/^[0-9]$/.test(e.key)) pressKey(e.key);
      else if (e.key === "Backspace") backspace();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [backspace, pressKey, showQr]);

  const isError = status === "error";
  const isSuccess = status === "success";

  return (
    <motion.section
      key="lockscreen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-5 py-10 safe-bottom"
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-7 flex flex-col items-center text-center sm:mb-9"
      >
        <div className="relative mb-5">
          <span className="absolute inset-0 rounded-full bg-blush/40 animate-pulse-ring" />
          <div className="relative grid h-[74px] w-[74px] place-items-center rounded-full bg-gradient-to-br from-blush via-rose to-amber-300 shadow-[0_0_50px_-6px_rgba(244,114,182,0.75)]">
            <motion.div
              animate={isSuccess ? { scale: [1, 1.35, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              {isSuccess ? (
                <Heart className="h-8 w-8 fill-white text-white" />
              ) : (
                <Lock className="h-7 w-7 text-white" strokeWidth={2.2} />
              )}
            </motion.div>
          </div>
        </div>

        <h1 className="font-display text-[30px] leading-tight tracking-tight text-gradient-pink sm:text-[42px]">
          {securityConfig.lockTitle}
        </h1>
        <p className="mt-2.5 max-w-[19rem] text-[13px] leading-relaxed text-white/60 sm:max-w-sm sm:text-sm">
          {securityConfig.lockSubtitle}
        </p>
      </motion.div>

      {/* PIN dots */}
      <motion.div
        animate={isError ? { x: [0, -10, 9, -7, 5, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="mb-7 flex items-center gap-3.5 sm:mb-9 sm:gap-4"
      >
        {Array.from({ length: PIN_LENGTH }).map((_, i) => {
          const filled = i < pin.length;
          return (
            <motion.span
              key={i}
              animate={{
                scale: filled ? 1 : 0.82,
                backgroundColor: isError
                  ? "#fb7185"
                  : isSuccess
                    ? "#fcd34d"
                    : filled
                      ? "#f472b6"
                      : "rgba(255,255,255,0.13)",
                boxShadow: filled
                  ? "0 0 22px -2px rgba(244,114,182,0.85)"
                  : "0 0 0 rgba(0,0,0,0)",
              }}
              transition={{ type: "spring", stiffness: 520, damping: 22 }}
              className="h-[14px] w-[14px] rounded-full border border-white/20 sm:h-4 sm:w-4"
            />
          );
        })}
      </motion.div>

      {/* Keypad */}
      <div className="grid w-full max-w-[292px] grid-cols-3 gap-3 sm:max-w-[330px] sm:gap-3.5">
        {KEYS.map((k) => (
          <KeyButton key={k} label={k} onPress={() => pressKey(k)} disabled={status !== "idle"} />
        ))}

        <button
          type="button"
          onClick={() => {
            playPop();
            setShowHint((s) => !s);
          }}
          aria-label="Tampilkan hint"
          className="touch-target grid aspect-square place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/45 transition-colors hover:bg-white/[0.09] hover:text-blush active:scale-95"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <KeyButton label="0" onPress={() => pressKey("0")} disabled={status !== "idle"} />

        <button
          type="button"
          onClick={backspace}
          aria-label="Hapus"
          className="touch-target grid aspect-square place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/45 transition-colors hover:bg-white/[0.09] hover:text-rose active:scale-95"
        >
          <Delete className="h-5 w-5" />
        </button>
      </div>

      {/* Hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] text-amber-200/90 sm:text-[13px]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span>{securityConfig.pinHint}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR trigger */}
      {qrConfig.enabled && (
        <button
          type="button"
          onClick={() => {
            playPop();
            setShowQr(true);
          }}
          className="mt-7 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[12px] text-white/55 transition-colors hover:border-blush/40 hover:text-blush sm:text-[13px]"
        >
          <QrCode className="h-4 w-4" />
          {qrConfig.buttonLabel}
        </button>
      )}

      {/* Modal PIN salah */}
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 26, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 340, damping: 24 }}
              className="glass-strong w-full max-w-xs rounded-[26px] px-6 py-7 text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, -12, 12, -8, 0], y: [0, -6, 0] }}
                transition={{ duration: 0.7 }}
                className="mx-auto mb-3 text-5xl"
              >
                🥺
              </motion.div>
              <h3 className="font-display text-xl text-rose">
                {securityConfig.wrongPinTitle}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/65">
                {securityConfig.wrongPinMessage}
              </p>
              <p className="mt-3.5 rounded-xl bg-amber-300/10 px-3 py-2 text-[12px] text-amber-200/90">
                {securityConfig.pinHint}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal QR */}
      <AnimatePresence>
        {showQr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQr(false)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.86, y: 26, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-strong relative w-full max-w-[330px] rounded-[28px] p-6 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowQr(false)}
                aria-label="Tutup"
                className="absolute right-3.5 top-3.5 grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </button>
              <QrShare />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flash sukses */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.2, times: [0, 0.25, 1] }}
            className="pointer-events-none fixed inset-0 z-40 bg-gradient-to-br from-blush/40 via-rose/25 to-amber-200/30"
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}

/* -------------------------------------------------------------------------- */

function KeyButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onPress}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className="touch-target group relative grid aspect-square place-items-center overflow-hidden rounded-2xl border border-white/12 bg-white/[0.055] font-display text-[26px] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.13)] transition-colors hover:border-blush/45 hover:bg-white/[0.1] disabled:opacity-40 sm:text-[28px]"
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-blush/25 to-transparent opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-100"
      />
      <span className="relative">{label}</span>
    </motion.button>
  );
}
