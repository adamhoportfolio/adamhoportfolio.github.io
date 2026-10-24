"use client";
import { useEffect, useRef } from "react";

// Short silent screen clip that plays on a loop, like a GIF.
// Use in .mdx posts:  <Clip src="/videos/clip.webm" poster="/images/clip.png" label="What the clip shows" />
// React doesn't render `muted` into the server HTML, so browsers block autoplay;
// set it on the element and start playback after hydration instead.
export default function Clip({ src, poster, label }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {}); // autoplay refused (e.g. reduced data mode): the poster stays up
  }, []);
  return (
    <video
      ref={ref}
      className="clip"
      src={src}
      poster={poster || undefined}
      aria-label={label}
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
