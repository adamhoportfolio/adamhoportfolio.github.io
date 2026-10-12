"use client";
import { useEffect, useRef } from "react";

// Faint drifting dots that connect when close and move away from the cursor.
// Pauses when the tab is hidden. Static (no motion) for reduced-motion users.
export default function Backdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const LINK = 120;   // px: max distance for a connecting line
    const PUSH = 130;   // px: cursor repel radius
    const ptr = { x: -1e4, y: -1e4 };
    let w = 0, h = 0, dots = [], raf = 0, last = 0;

    const spawn = () => {
      const a = Math.random() * Math.PI * 2;
      const sp = 8 + Math.random() * 14; // px per second
      return {
        x: Math.random() * w, y: Math.random() * h,
        bx: Math.cos(a) * sp, by: Math.sin(a) * sp,
        vx: 0, vy: 0, r: 1 + Math.random() * 1.2,
      };
    };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, Math.max(26, (w * h) / 24000)));
      while (dots.length < n) { const d = spawn(); d.vx = d.bx; d.vy = d.by; dots.push(d); }
      dots.length = Math.min(dots.length, n);
      if (reduce) draw();
    };

    const step = (dt) => {
      const relax = 1 - Math.exp(-1.6 * dt);
      for (const d of dots) {
        const dx = d.x - ptr.x, dy = d.y - ptr.y;
        const dist = Math.hypot(dx, dy);
        if (dist < PUSH && dist > 0.01) {
          const f = (1 - dist / PUSH);
          d.vx += (dx / dist) * f * 520 * dt;
          d.vy += (dy / dist) * f * 520 * dt;
        }
        d.vx += (d.bx - d.vx) * relax;
        d.vy += (d.by - d.vy) * relax;
        d.x += d.vx * dt; d.y += d.vy * dt;
        if (d.x < -10) d.x = w + 10; else if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10; else if (d.y > h + 10) d.y = -10;
      }
    };

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const a = (1 - Math.sqrt(d2) / LINK) * 0.14;
            ctx.strokeStyle = `rgba(150,170,215,${a})`;
            ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(190,200,235,0.42)";
      for (const d of dots) { ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill(); }
    }

    const frame = (t) => {
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
      last = t; step(dt); draw();
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (!raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const onMove = (e) => { ptr.x = e.clientX; ptr.y = e.clientY; };
    const away = () => { ptr.x = -1e4; ptr.y = -1e4; };
    const onUp = (e) => { if (e.pointerType === "touch") away(); };
    const onVis = () => (document.hidden ? stop() : start());
    let rz = 0;
    const onResize = () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(size); };

    size(); start();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", away);
    document.documentElement.addEventListener("pointerleave", away);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize);
    return () => {
      stop(); cancelAnimationFrame(rz);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", away);
      document.documentElement.removeEventListener("pointerleave", away);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="backdrop" aria-hidden="true" />;
}
