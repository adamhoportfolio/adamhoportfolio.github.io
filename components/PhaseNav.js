"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";

// Sticky bar for posts written in phases: a back-to-top button, the phase being read
// (click one to jump to it), and a switch that opens or closes every "More detail" block.
// Use in .mdx posts:  <PhaseNav phases="pipeline:Pipeline, model:Model & test, ..." />
// (a string, because next-mdx-remote blocks JavaScript expressions in MDX props).
// Each id must be the id of a heading in the post.
export default function PhaseNav({ phases: spec }) {
  const phases = useMemo(
    () => spec.split(",").map((s) => { const [id, ...label] = s.split(":"); return { id: id.trim(), label: label.join(":").trim() }; }),
    [spec],
  );
  const [active, setActive] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const list = useRef(null);

  // on narrow screens the bar scrolls sideways; keep the current phase in view
  useEffect(() => {
    const ol = list.current;
    const a = ol?.querySelector("[aria-current]");
    if (ol && a) ol.scrollTo({ left: a.offsetLeft - ol.clientWidth / 2 + a.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = null;
      for (const p of phases) {
        const el = document.getElementById(p.id);
        if (el && el.getBoundingClientRect().top < 120) current = p.id;
      }
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [phases]);

  const toggleAll = () => {
    const open = !expanded;
    document.querySelectorAll(".prose details").forEach((d) => { d.open = open; });
    setExpanded(open);
    track("details_toggle_all", { open, page_slug: window.location.pathname });
  };

  return (
    <nav className="phase-nav" aria-label="Phases">
      <button type="button" className="phase-top" aria-label="Back to top"
        onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); track("back_to_top", { page_slug: window.location.pathname }); }}>
        ↑
      </button>
      <ol ref={list}>
        {phases.map((p, k) => (
          <li key={p.id}>
            <a href={`#${p.id}`} aria-current={active === p.id ? "step" : undefined}
              onClick={() => track("phase_nav_click", { phase: p.id, page_slug: window.location.pathname })}>
              <span className="phase-num">{k + 1}</span> {p.label}
            </a>
          </li>
        ))}
      </ol>
      <button type="button" onClick={toggleAll} aria-pressed={expanded}>
        {expanded ? "Collapse all" : "Expand all"}
      </button>
    </nav>
  );
}
