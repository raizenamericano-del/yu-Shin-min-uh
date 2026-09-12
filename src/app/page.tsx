"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import BackgroundFX from "@/components/BackgroundFX";
import BackgroundMusic, { type BackgroundMusicHandle } from "@/components/BackgroundMusic";
import GiftHub from "@/components/GiftHub";
import LetterModal from "@/components/LetterModal";
import LockScreen from "@/components/LockScreen";

type Stage = "lock" | "letter" | "hub";

export default function Home() {
  const [stage, setStage] = useState<Stage>("lock");
  const musicRef = useRef<BackgroundMusicHandle>(null);

  const handleUnlock = useCallback(() => {
    setStage("letter");
    // Musik latar mulai setelah interaksi user (agar lolos kebijakan autoplay browser)
    musicRef.current?.play();
  }, []);

  const handleLetterFinish = useCallback(() => setStage("hub"), []);

  const handleRestart = useCallback(() => {
    setStage("lock");
    musicRef.current?.pause();
  }, []);

  /** Kecilkan musik latar saat lagu di playlist diputar. */
  const handleSongPlayState = useCallback((playing: boolean) => {
    musicRef.current?.duck(playing);
  }, []);

  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-hidden">
      <BackgroundFX />

      <AnimatePresence mode="wait">
        {stage === "lock" && <LockScreen key="lock" onUnlock={handleUnlock} />}
        {stage === "letter" && (
          <LetterModal key="letter" onFinish={handleLetterFinish} />
        )}
        {stage === "hub" && (
          <GiftHub
            key="hub"
            onRestart={handleRestart}
            onSongPlayStateChange={handleSongPlayState}
          />
        )}
      </AnimatePresence>

      <BackgroundMusic ref={musicRef} visible={stage !== "lock"} />
    </main>
  );
}
