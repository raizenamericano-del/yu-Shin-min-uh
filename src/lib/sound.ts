/**
 * sound.ts — SFX ringan berbasis Web Audio API.
 * Tidak butuh file audio sama sekali (semua nada disintesis on the fly),
 * jadi template ini tetap bunyi walau kamu belum upload aset apa pun.
 */

type Ctx = AudioContext | null;

let ctx: Ctx = null;
let muted = false;

function getCtx(): Ctx {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setSfxMuted(value: boolean) {
  muted = value;
}

export function isSfxMuted() {
  return muted;
}

interface ToneOptions {
  freq: number;
  duration?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  sweepTo?: number;
}

function tone({
  freq,
  duration = 0.16,
  type = "sine",
  gain = 0.08,
  delay = 0,
  sweepTo,
}: ToneOptions) {
  const ac = getCtx();
  if (!ac || muted) return;

  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, t0 + duration);

  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(g).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.03);
}

/** Klik tombol PIN — blip pendek dan lembut. */
export function playKeyTap(index = 0) {
  const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77];
  tone({
    freq: scale[index % scale.length],
    duration: 0.1,
    type: "sine",
    gain: 0.07,
  });
}

/** PIN benar — arpeggio ceria. */
export function playSuccess() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
    tone({ freq: f, duration: 0.42, type: "triangle", gain: 0.1, delay: i * 0.09 }),
  );
  tone({ freq: 1318.5, duration: 0.7, type: "sine", gain: 0.05, delay: 0.42 });
}

/** PIN salah — dua nada turun. */
export function playError() {
  tone({ freq: 311.13, duration: 0.2, type: "sawtooth", gain: 0.05 });
  tone({ freq: 233.08, duration: 0.32, type: "sawtooth", gain: 0.05, delay: 0.14 });
}

/** Amplop dibuka — swoosh naik. */
export function playOpen() {
  tone({ freq: 320, sweepTo: 900, duration: 0.5, type: "sine", gain: 0.07 });
  tone({ freq: 880, duration: 0.5, type: "triangle", gain: 0.04, delay: 0.16 });
}

/** Ganti halaman surat — sfx kertas. */
export function playPageTurn() {
  const ac = getCtx();
  if (!ac || muted) return;

  const dur = 0.24;
  const buffer = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const decay = 1 - i / data.length;
    data[i] = (Math.random() * 2 - 1) * decay * decay * 0.5;
  }

  const src = ac.createBufferSource();
  src.buffer = buffer;

  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1400, ac.currentTime);
  filter.frequency.exponentialRampToValueAtTime(3600, ac.currentTime + dur);
  filter.Q.value = 0.9;

  const g = ac.createGain();
  g.gain.setValueAtTime(0.16, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);

  src.connect(filter).connect(g).connect(ac.destination);
  src.start();
}

/** Buka kartu hadiah — chime lembut. */
export function playChime() {
  [783.99, 1046.5, 1318.51].forEach((f, i) =>
    tone({ freq: f, duration: 0.6, type: "sine", gain: 0.06, delay: i * 0.07 }),
  );
}

/** Hover / navigasi ringan. */
export function playPop() {
  tone({ freq: 660, sweepTo: 990, duration: 0.1, type: "sine", gain: 0.05 });
}

/** Bunga mekar — sparkle naik. */
export function playBloom() {
  [659.25, 830.61, 987.77, 1244.51, 1567.98].forEach((f, i) =>
    tone({ freq: f, duration: 0.5, type: "sine", gain: 0.045, delay: i * 0.08 }),
  );
}
