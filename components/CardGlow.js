"use client";
import { useEffect } from "react";

// One delegated listener: tells the hovered .card where the cursor is,
// so CSS can draw a soft glow under it. Mouse/pen only.
export default function CardGlow() {
  useEffect(() => {
    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      const card = e.target instanceof Element ? e.target.closest(".card") : null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left + 18}px`); // +18: glow extends 18px past the card
      card.style.setProperty("--my", `${e.clientY - r.top + 18}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
