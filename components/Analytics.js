"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, pageview, track, isLocalhost, DEBUG_EVENT } from "@/lib/analytics";

// Starts analytics once per page load (page views + custom events).
export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => { initAnalytics(); }, []);
  useEffect(() => { pageview(pathname); }, [pathname]);
  useEffect(() => {
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true); // middle-click "open in new tab"
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, []);
  return <DevEventLog />;
}

// Which part of the page a click came from.
const AREAS = [["header", "header"], ["footer", "footer"], [".callout", "callout"],
  [".card", "project_card"], [".prose", "post_body"]];

// One delegated listener for every link on the site:
//   - an element with data-track="event" sends that event, with its
//     data-track-* attributes as properties (see Header, Footer, ProjectCard)
//   - any other link sends link_click
// Beacon transport so the event survives a same-tab navigation away.
function onClick(e) {
  if (e.type === "auxclick" && e.button !== 1) return;
  const el = e.target instanceof Element ? e.target.closest("[data-track], a[href]") : null;
  if (!el) return;
  const area = AREAS.find(([sel]) => el.closest(sel))?.[1] || "page";
  const page = window.location.pathname;
  const href = el.getAttribute("href") || "";
  let url = null;
  try { url = new URL(href, window.location.href); } catch {}
  const isExternal = Boolean(url) && url.origin !== window.location.origin;
  const common = { area, page, is_external: isExternal, new_tab: e.type === "auxclick" || e.metaKey || e.ctrlKey || el.target === "_blank" };

  if (el.dataset.track) {
    const props = {};
    for (const [k, v] of Object.entries(el.dataset)) {
      if (!k.startsWith("track") || k === "track") continue;
      const key = k.slice(5).replace(/[A-Z]/g, (c) => "_" + c.toLowerCase()).replace(/^_/, "");
      props[key] = v === "true" ? true : v === "false" ? false : /^\d+$/.test(v) ? Number(v) : v;
    }
    track(el.dataset.track, { ...common, ...props }, { beacon: true });
    return;
  }
  if (!url || !/^https?:$/.test(url.protocol)) return; // skip mailto:, #anchors handled below
  if (!isExternal && url.pathname === window.location.pathname && url.hash) return; // in-page anchor
  track("link_click", {
    ...common,
    href: url.href,
    domain: url.hostname,
    text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 80),
  }, { beacon: true });
}

// localhost only: a small panel listing the events that would have been sent.
function DevEventLog() {
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!isLocalhost()) return;
    setOn(true);
    const onEvent = (e) => setEvents((list) => [e.detail, ...list].slice(0, 30));
    window.addEventListener(DEBUG_EVENT, onEvent);
    return () => window.removeEventListener(DEBUG_EVENT, onEvent);
  }, []);

  if (!on) return null;
  return (
    <aside className="devlog" aria-label="Analytics debug log">
      <button type="button" onClick={() => setOpen(!open)}>
        analytics (dry run) · {events.length} {open ? "▾" : "▸"}
      </button>
      {open ? (
        <ol>
          {events.length === 0 ? <li className="devlog-empty">no events yet</li> : null}
          {events.map((e, i) => (
            <li key={e.at + "-" + i} title={JSON.stringify(e.props, null, 2)}>
              <time>{new Date(e.at).toLocaleTimeString()}</time> <strong>{e.event}</strong>{" "}
              <span>{summary(e.props)}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </aside>
  );
}

// the most useful props inline; hover a row for the full payload
function summary(p) {
  const keys = ["item", "slug", "position", "target", "area", "domain", "percent",
    "watched_seconds", "completion_pct", "from", "to", "is_first_play", "path"];
  return keys.filter((k) => k in p).map((k) => `${k}=${p[k]}`).join(" ");
}
