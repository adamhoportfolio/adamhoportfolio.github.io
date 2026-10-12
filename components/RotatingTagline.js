"use client";
import { useEffect, useState } from "react";

// Cycles through short taglines with a fade. Screen readers get all of them as static text.
export default function RotatingTagline({ items }) {
  const [i, setI] = useState(0);
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (items.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let swap = 0;
    const timer = setInterval(() => {
      setOn(false);
      swap = setTimeout(() => { setI((n) => (n + 1) % items.length); setOn(true); }, 350);
    }, 3600);
    return () => { clearInterval(timer); clearTimeout(swap); };
  }, [items.length]);

  return (
    <p className="site-tagline">
      <span className="sr-only">{items.join(", ")}</span>
      <span aria-hidden="true" className={`rot${on ? " on" : ""}`}>{items[i]}</span>
    </p>
  );
}
