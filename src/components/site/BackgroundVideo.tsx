import { useEffect, useRef, useState } from "react";

/**
 * Fullscreen looping background video with a dynamic dark overlay.
 * The overlay opacity is driven by the average luminance of the video
 * frame so text stays readable on both bright and dark moments.
 */
export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  // Default mid-strength overlay until first sample arrives.
  const [overlayAlpha, setOverlayAlpha] = useState(0.55);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Tiny offscreen canvas — we only need a few pixels for luminance.
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    canvas.width = 32;
    canvas.height = 18;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let lastSample = 0;
    const SAMPLE_INTERVAL_MS = 200; // 5x per second is plenty.

    const sample = (now: number) => {
      if (video.readyState >= 2 && now - lastSample >= SAMPLE_INTERVAL_MS) {
        lastSample = now;
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let total = 0;
          for (let i = 0; i < data.length; i += 4) {
            // Rec. 709 luma
            total += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
          }
          const avg = total / (data.length / 4) / 255; // 0..1
          // Brighter video → heavier overlay. Map [0..1] luma to [0.45..0.78] alpha.
          const next = 0.45 + Math.min(1, Math.max(0, avg)) * 0.33;
          setOverlayAlpha((prev) => prev + (next - prev) * 0.25); // ease toward target
        } catch {
          // CORS or decode hiccup — just keep previous value.
        }
      }
      rafRef.current = requestAnimationFrame(sample);
    };

    const start = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(sample);
    };
    const stop = () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    // Slow the background footage to ~1/3 speed for a calmer ambience.
    const SLOWMO = 1 / 3;
    const applyRate = () => { try { video.playbackRate = SLOWMO; } catch {} };
    applyRate();
    video.addEventListener("loadedmetadata", applyRate);
    video.addEventListener("play", applyRate);
    video.addEventListener("ratechange", () => {
      if (Math.abs(video.playbackRate - SLOWMO) > 0.01) applyRate();
    });

    video.addEventListener("playing", start);
    video.addEventListener("pause", stop);
    video.addEventListener("ended", stop);
    if (!video.paused) start();

    return () => {
      stop();
      video.removeEventListener("playing", start);
      video.removeEventListener("pause", stop);
      video.removeEventListener("ended", stop);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src="/video/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
      />
      {/* Dynamic flat overlay — opacity tracks video brightness */}
      <div
        className="absolute inset-0 bg-background transition-opacity duration-500"
        style={{ opacity: overlayAlpha }}
      />
      {/* Vignette to keep edges + top/bottom (where text lives) extra readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.14 0.005 60 / 55%) 0%, transparent 25%, transparent 70%, oklch(0.14 0.005 60 / 70%) 100%)",
        }}
      />
    </div>
  );
}
