"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Letters scramble, then lock in left to right on each page load.
// Server HTML and screen readers always get the real text.
export default function DecodeText({ text }) {
  const ref = useRef(null);
  const [out, setOut] = useState(text);
  const pathname = usePathname();

  useEffect(() => {
    setOut(text);
    if (pathname !== "/") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (el) el.style.minWidth = `${el.offsetWidth}px`; // hold width so the layout doesn't jump
    const DURATION = 900;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / DURATION);
      const locked = Math.floor(t * text.length);
      setOut(
        text.split("").map((c, i) =>
          c === " " || i < locked ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ).join("")
      );
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setOut(text);
        if (el) el.style.minWidth = "";
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pathname, text]);

  return (
    <span ref={ref} className="decode">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
