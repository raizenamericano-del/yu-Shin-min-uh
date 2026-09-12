"use client";

import { useEffect, useRef } from "react";
import { ambienceConfig } from "@/config/bucinData";
import { useReducedMotion } from "@/lib/hooks";

/* -------------------------------------------------------------------------- */
/*  Canvas: bintang berkelip + hati melayang + partikel debu emas              */
/* -------------------------------------------------------------------------- */

interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  hue: "white" | "pink" | "gold";
}

interface Heart {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  phase: number;
  opacity: number;
  color: string;
}

const HEART_COLORS = ["#f472b6", "#fb7185", "#fbcfe8", "#fda4af", "#fcd34d"];

function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 24, size / 24);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  // Path hati (koordinat 24x24, dipusatkan)
  ctx.moveTo(0, 5);
  ctx.bezierCurveTo(0, 2, -3, -4, -8, -4);
  ctx.bezierCurveTo(-15, -4, -15, 4, -15, 4);
  ctx.bezierCurveTo(-15, 9, -10, 14, 0, 20);
  ctx.bezierCurveTo(10, 14, 15, 9, 15, 4);
  ctx.bezierCurveTo(15, 4, 15, -4, 8, -4);
  ctx.bezierCurveTo(3, -4, 0, 2, 0, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let hearts: Heart[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const starCount = ambienceConfig.enableTwinklingStars
        ? Math.min(150, Math.round(area / 9000))
        : 0;
      const heartCount = ambienceConfig.enableFloatingHearts
        ? Math.min(26, Math.round(area / 52000))
        : 0;

      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.35,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.9 + 0.35,
        hue:
          Math.random() > 0.82 ? "pink" : Math.random() > 0.9 ? "gold" : "white",
      }));

      hearts = Array.from({ length: heartCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height + height * 0.2,
        size: Math.random() * 16 + 9,
        speed: Math.random() * 0.35 + 0.14,
        drift: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.32 + 0.1,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
      }));
    };

    setup();

    if (reduced) {
      // Render statis satu kali
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      return () => window.removeEventListener("resize", setup);
    }

    let t = 0;
    const render = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Bintang
      for (const s of stars) {
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(s.phase + t * s.speed));
        ctx.globalAlpha = tw * 0.85;
        ctx.fillStyle =
          s.hue === "pink" ? "#f9a8d4" : s.hue === "gold" ? "#fcd34d" : "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.8 + tw * 0.5), 0, Math.PI * 2);
        ctx.fill();

        if (s.r > 1.15 && tw > 0.85) {
          ctx.globalAlpha = (tw - 0.85) * 1.6;
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = 0.6;
          const len = s.r * 4;
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y);
          ctx.lineTo(s.x + len, s.y);
          ctx.moveTo(s.x, s.y - len);
          ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }
      }

      // Hati melayang
      for (const h of hearts) {
        h.y -= h.speed;
        h.phase += 0.01;
        const x = h.x + Math.sin(h.phase) * (h.drift * 26);
        if (h.y < -40) {
          h.y = height + 30;
          h.x = Math.random() * width;
        }
        drawHeart(ctx, x, h.y, h.size, h.color, h.opacity);
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 180);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
      />
      {/* Aurora blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-32 top-[-10%] h-[46vh] w-[46vh] rounded-full bg-blush/20 blur-[110px] animate-float-y" />
        <div
          className="absolute -right-24 top-[22%] h-[38vh] w-[38vh] rounded-full bg-indigo-500/20 blur-[110px] animate-float-y"
          style={{ animationDelay: "1.6s" }}
        />
        <div
          className="absolute bottom-[-14%] left-1/3 h-[42vh] w-[42vh] rounded-full bg-rose/15 blur-[120px] animate-float-y"
          style={{ animationDelay: "3.1s" }}
        />
      </div>
      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, transparent 42%, rgba(5,7,20,0.55) 100%)",
        }}
      />
    </>
  );
}
