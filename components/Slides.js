"use client";
import { Children, useRef, useState } from "react";
import { track } from "@/lib/analytics";

// A slideshow of figures. Use in .mdx posts:
//   <Slides name="dbt">
//   <Slide caption="`dbt` lineage">![...](/images/a.png)</Slide>
//   <Slide caption="A model's docs page">![...](/images/b.png)</Slide>
//   </Slides>
// The controls sit above the slide, so they stay put while the slide height changes.
// Arrow buttons, arrow keys and swiping all change slides.
export function Slide({ children }) {
  return children;
}

// Captions are plain strings; `backticks` become <code>.
const withCode = (text = "") =>
  text.split("`").map((part, k) => (k % 2 ? <code key={k}>{part}</code> : part));

export default function Slides({ name, children }) {
  const slides = Children.toArray(children).filter((c) => c?.props);
  const [i, setI] = useState(0);
  const startX = useRef(null);
  const swiped = useRef(false); // a swipe ends in a click; don't let it open the image zoom
  const n = slides.length;

  const go = (next, how) => {
    const j = (next + n) % n;
    setI(j);
    track("slide_view", { slideshow: name, slide: j + 1, of: n, how, page_slug: window.location.pathname });
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") go(i + 1, "key");
    if (e.key === "ArrowLeft") go(i - 1, "key");
  };
  const onDown = (e) => { startX.current = e.clientX; swiped.current = false; };
  const onUp = (e) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) {
      swiped.current = true;
      go(i + (dx < 0 ? 1 : -1), "swipe");
    }
  };
  const onClickCapture = (e) => {
    if (swiped.current) { e.stopPropagation(); e.preventDefault(); swiped.current = false; }
  };

  return (
    <figure className="slides" role="region" aria-roledescription="carousel" aria-label={name}
      tabIndex={0} onKeyDown={onKey} onPointerDown={onDown} onPointerUp={onUp} onClickCapture={onClickCapture}>
      <div className="slides-bar">
        <button type="button" onClick={() => go(i - 1, "button")} aria-label="Previous slide">‹</button>
        <span className="slides-caption" aria-live="polite">
          <span className="slides-count">{i + 1} / {n}</span> {withCode(slides[i].props.caption)}
        </span>
        <button type="button" onClick={() => go(i + 1, "button")} aria-label="Next slide">›</button>
      </div>
      <div className="slides-stage">
        {slides.map((s, k) => (
          <div key={k} className="slide" hidden={k !== i} aria-roledescription="slide" aria-label={`${k + 1} of ${n}`}>
            {s.props.children}
          </div>
        ))}
      </div>
    </figure>
  );
}
