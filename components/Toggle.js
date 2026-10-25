"use client";
import { Children, useId, useState } from "react";
import { track } from "@/lib/analytics";

// Two or more views of the same thing, one at a time. Use in .mdx posts:
//   <Toggle name="extractor">
//   <Pane label="Raw listing">...</Pane>
//   <Pane label="Extracted fields">...</Pane>
//   </Toggle>
export function Pane({ children }) {
  return children;
}

export default function Toggle({ name, children }) {
  const panes = Children.toArray(children).filter((c) => c?.props);
  const [i, setI] = useState(0);
  const id = useId();

  const pick = (j) => {
    if (j === i) return;
    setI(j);
    track("toggle_view", { toggle: name, view: panes[j].props.label, page_slug: window.location.pathname });
  };
  const onKey = (e) => {
    if (e.key === "ArrowRight") pick((i + 1) % panes.length);
    if (e.key === "ArrowLeft") pick((i - 1 + panes.length) % panes.length);
  };

  return (
    <div className="toggle">
      <div className="toggle-tabs" role="tablist" aria-label={name} onKeyDown={onKey}>
        {panes.map((p, k) => (
          <button key={k} type="button" role="tab" id={`${id}-t${k}`} aria-controls={`${id}-p${k}`}
            aria-selected={k === i} tabIndex={k === i ? 0 : -1} onClick={() => pick(k)}>
            {p.props.label}
          </button>
        ))}
      </div>
      <div className="toggle-stage">
        {panes.map((p, k) => (
          <div key={k} role="tabpanel" id={`${id}-p${k}`} aria-labelledby={`${id}-t${k}`}
            className="toggle-pane" hidden={k !== i}>
            {p.props.children}
          </div>
        ))}
      </div>
    </div>
  );
}
