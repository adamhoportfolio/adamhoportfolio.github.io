"use client";
import { track } from "@/lib/analytics";

// A row of headline numbers, each linking to the part of the post that proves it.
// Use in .mdx posts:  <Stats items="11,500+|posts tracked|#pipeline; 52|data tests|#model" />
// (one string, because next-mdx-remote blocks JavaScript expressions in MDX props).
// If the target sits inside a closed "More detail" block, the click opens it first.
export default function Stats({ items }) {
  const stats = items.split(";").map((s) => {
    const [value, label, href] = s.split("|").map((x) => x.trim());
    return { value, label, href };
  });

  const go = (e, s) => {
    const target = s.href?.startsWith("#") && document.getElementById(s.href.slice(1));
    track("stat_click", { stat: s.label, page_slug: window.location.pathname });
    if (!target) return;
    e.preventDefault();
    for (let d = target.closest("details"); d; d = d.parentElement?.closest("details")) d.open = true;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", s.href);
  };

  return (
    <ul className="stats">
      {stats.map((s) => (
        <li key={s.label}>
          <a href={s.href} onClick={(e) => go(e, s)}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
