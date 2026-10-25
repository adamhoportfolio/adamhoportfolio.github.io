"use client";
import { useEffect, useRef } from "react";

// Short silent screen clip that plays on a loop, like a GIF.
// Use in .mdx posts:  <Clip src="/videos/clip.webm" poster="/images/clip.png" label="What the clip shows" />
// or set `heroClip:` in a post's frontmatter to play one in place of the hero image.
// React doesn't render `muted` into the server HTML, so browsers block autoplay;
// set it on the element and start playback after hydration instead.
export default function Clip({ src, poster, label, className = "clip" }) {
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
      className={className}
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
