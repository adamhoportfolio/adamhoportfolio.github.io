"use client";
import { useEffect, useRef } from "react";

// Short silent screen clip that plays on a loop, like a GIF.
// Use in .mdx posts:  <Clip src="/videos/clip.webm" poster="/images/clip.png" label="What the clip shows" />
// or set `heroClip:` in a post's frontmatter to play one in place of the hero image
// (it also animates the post's card on the home page).
// A `#t=5.6` suffix on src skips that many seconds of lead-in, on every loop.
// It plays only while on screen, and not at all for visitors who prefer reduced motion
// (the poster stays up). React doesn't render `muted` into the server HTML, so browsers
// would block autoplay; it's set here after hydration instead.
export default function Clip({ src, poster, label, className = "clip" }) {
  const ref = useRef(null);
  const start = Number(/#t=([\d.]+)/.exec(src)?.[1] || 0);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const restart = () => {
      v.currentTime = start;
      v.play().catch(() => {});
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {}); // autoplay refused: the poster stays up
      else v.pause();
    });
    io.observe(v);
    v.addEventListener("ended", restart);
    return () => {
      io.disconnect();
      v.removeEventListener("ended", restart);
    };
  }, [start]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster || undefined}
      aria-label={label}
      muted
      playsInline
      preload="metadata"
    />
  );
}
