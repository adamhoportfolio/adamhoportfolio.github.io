"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Thin bar at the top of project pages that fills as you scroll.
export default function ReadingProgress() {
  const pathname = usePathname();
  const bar = useRef(null);
  const active = pathname.startsWith("/blog-posts/");

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [active, pathname]);

  if (!active) return null;
  return <div ref={bar} className="progress" aria-hidden="true" />;
}
