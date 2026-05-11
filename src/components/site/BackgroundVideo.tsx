export function BackgroundVideo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <video
        className="h-full w-full object-cover"
        src="/video/bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-background/55" />
    </div>
  );
}
