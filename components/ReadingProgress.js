"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 100];

// Thin bar at the top of project pages that fills as you scroll.
// Also reports post_read_depth once per milestone per visit to a post.
export default function ReadingProgress() {
  const pathname = usePathname();
  const bar = useRef(null);
  const active = pathname.startsWith("/blog-posts/");

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const reached = new Set();
    const slug = pathname.split("/").filter(Boolean)[1];
    const update = () => {
      raf = 0;
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
      for (const m of MILESTONES) {
        if (reached.has(m) || p * 100 < m - 1) continue; // -1: the very bottom can be off by a pixel
        reached.add(m);
        track("post_read_depth", { slug, percent: m });
      }
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
