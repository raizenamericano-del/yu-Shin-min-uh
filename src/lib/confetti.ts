import confetti from "canvas-confetti";

const PINK_PALETTE = ["#f472b6", "#fb7185", "#fcd34d", "#fbcfe8", "#f9a8d4", "#fda4af"];

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

/** Bentuk hati untuk confetti (dipakai canvas-confetti sebagai custom shape). */
function heartShape() {
  // confetti.shapeFromPath tersedia di canvas-confetti >= 1.6
  return confetti.shapeFromPath(HEART_PATH);
}

let cachedHeart: ReturnType<typeof confetti.shapeFromPath> | null = null;
function getHeart() {
  if (typeof window === "undefined") return undefined;
  if (!cachedHeart) {
    try {
      cachedHeart = heartShape();
    } catch {
      return undefined;
    }
  }
  return cachedHeart;
}

/** Ledakan hati besar — dipakai saat PIN berhasil. */
export function loveExplosion() {
  if (typeof window === "undefined") return;
  const heart = getHeart();
  const shapes = heart ? [heart, "circle" as const] : undefined;

  const base: confetti.Options = {
    colors: PINK_PALETTE,
    disableForReducedMotion: true,
    scalar: 1.1,
    ...(shapes ? { shapes } : {}),
  };

  void confetti({ ...base, particleCount: 90, spread: 78, origin: { y: 0.62 } });

  window.setTimeout(() => {
    void confetti({
      ...base,
      particleCount: 60,
      angle: 60,
      spread: 62,
      origin: { x: 0, y: 0.7 },
    });
  }, 160);

  window.setTimeout(() => {
    void confetti({
      ...base,
      particleCount: 60,
      angle: 120,
      spread: 62,
      origin: { x: 1, y: 0.7 },
    });
  }, 300);

  window.setTimeout(() => {
    void confetti({
      ...base,
      particleCount: 120,
      spread: 120,
      startVelocity: 42,
      origin: { y: 0.5 },
      scalar: 1.35,
    });
  }, 520);
}

/** Hujan hati lembut — dipakai saat surat/hadiah dibuka. */
export function heartRain(durationMs = 2600) {
  if (typeof window === "undefined") return;
  const heart = getHeart();
  const end = Date.now() + durationMs;

  const frame = () => {
    void confetti({
      particleCount: 2,
      startVelocity: 0,
      ticks: 220,
      gravity: 0.42,
      decay: 0.94,
      scalar: 1.2,
      colors: PINK_PALETTE,
      disableForReducedMotion: true,
      ...(heart ? { shapes: [heart] } : {}),
      origin: { x: Math.random(), y: -0.1 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

/** Semburan kecil dari sebuah titik (x,y dalam rasio 0–1). */
export function burstAt(x: number, y: number) {
  if (typeof window === "undefined") return;
  const heart = getHeart();
  void confetti({
    particleCount: 42,
    spread: 65,
    startVelocity: 26,
    scalar: 0.95,
    colors: PINK_PALETTE,
    disableForReducedMotion: true,
    ...(heart ? { shapes: [heart, "circle"] } : {}),
    origin: { x, y },
  });
}

/** Kelopak emas — dipakai di finale. */
export function goldShower() {
  if (typeof window === "undefined") return;
  void confetti({
    particleCount: 140,
    spread: 100,
    startVelocity: 38,
    colors: ["#fcd34d", "#fde68a", "#f472b6", "#ffffff"],
    disableForReducedMotion: true,
    origin: { y: 0.4 },
  });
}
