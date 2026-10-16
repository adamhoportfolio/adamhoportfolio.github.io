// The only file that knows which analytics vendor is used.
// Swap PostHog for Mixpanel etc. by changing init/track here.
//
// Modes:
//   live  - events go to PostHog
//   dry   - nothing is sent; events are logged to the console (and, on
//           localhost, shown in the on-page DevEventLog) as "would send"
//   off   - no PostHog key configured
// localhost is always dry. On the live site, visit any page with ?notrack once
// to make this browser dry (?notrack=0 turns tracking back on).
import { site } from "@/lib/site";

export const DEBUG_EVENT = "analytics:debug";

let mode = null;
let client = null; // posthog once loaded
const queue = []; // events fired before the lazy-loaded SDK arrives

export const isLocalhost = () => ["localhost", "127.0.0.1"].includes(window.location.hostname);

function optedOut() {
  try {
    const q = new URLSearchParams(window.location.search).get("notrack");
    if (q === "0") localStorage.removeItem("notrack");
    else if (q !== null) localStorage.setItem("notrack", "1");
    return localStorage.getItem("notrack") === "1";
  } catch {
    return false;
  }
}

function getMode() {
  if (mode) return mode;
  if (!site.posthogKey) mode = "off";
  else if (isLocalhost() || optedOut()) mode = "dry";
  else mode = "live";
  if (mode === "dry") console.info("[analytics] dry run: events are logged here, not sent to PostHog");
  return mode;
}

export function initAnalytics() {
  if (getMode() !== "live" || client) return;
  // loaded lazily so the SDK stays out of the initial page bundle
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(site.posthogKey, {
      api_host: site.posthogHost,
      capture_pageview: "history_change",
      autocapture: false,
      persistence: "localStorage",
    });
    client = posthog;
    queue.splice(0).forEach((args) => track(...args));
  });
}

// PostHog records page views itself in live mode; this only mirrors them in dry mode.
export function pageview(path) {
  if (getMode() === "dry") track("$pageview", { path });
}

// beacon: use for events fired while the page is being hidden/unloaded.
export function track(event, props = {}, { beacon = false } = {}) {
  const m = getMode();
  if (m === "off") return;
  if (m === "dry") {
    console.info(`[analytics] would send ${event}`, props);
    window.dispatchEvent(new CustomEvent(DEBUG_EVENT, { detail: { event, props, at: Date.now() } }));
    return;
  }
  if (!client) return void queue.push([event, props, { beacon }]);
  client.capture(event, props, beacon ? { transport: "sendBeacon" } : undefined);
}
