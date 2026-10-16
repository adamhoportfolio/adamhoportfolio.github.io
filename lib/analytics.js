// The only file that knows which analytics vendor is used.
// Swap PostHog for Mixpanel etc. by changing init/track here.
//
// Modes:
//   live  - events go to PostHog
//   dry   - localhost: nothing is sent; events are logged to the console and
//           the on-page DevEventLog as "would send"
//   off   - no PostHog key configured
//
// Owner tagging: visit the live site once with ?me to mark this browser as
// the site owner (?me=0 unmarks it). Events are still sent, but every one
// carries is_owner: true and all owner browsers share one PostHog person
// ("site-owner"), so they can be filtered out (or isolated) in PostHog.
// Owner browsers also log each sent event to the console.
import { site } from "@/lib/site";

export const DEBUG_EVENT = "analytics:debug";
const OWNER_KEY = "owner";
const OWNER_ID = "site-owner";

let mode = null;
let owner = false;
let client = null; // posthog once loaded
const queue = []; // events fired before the lazy-loaded SDK arrives

export const isLocalhost = () => ["localhost", "127.0.0.1"].includes(window.location.hostname);

// Reads/updates the owner flag from ?me. Returns [isOwner, justUnmarked].
function readOwner() {
  try {
    if (localStorage.getItem("notrack") === "1") { // flag from the earlier ?notrack version
      localStorage.removeItem("notrack");
      localStorage.setItem(OWNER_KEY, "1");
    }
    const q = new URLSearchParams(window.location.search).get("me");
    const was = localStorage.getItem(OWNER_KEY) === "1";
    if (q === "0") localStorage.removeItem(OWNER_KEY);
    else if (q !== null) localStorage.setItem(OWNER_KEY, "1");
    const now = localStorage.getItem(OWNER_KEY) === "1";
    return [now, was && !now];
  } catch {
    return [false, false];
  }
}

function getMode() {
  if (mode) return mode;
  if (!site.posthogKey) mode = "off";
  else if (isLocalhost()) mode = "dry";
  else mode = "live";
  if (mode === "dry") console.info("[analytics] dry run: events are logged here, not sent to PostHog");
  return mode;
}

export function initAnalytics() {
  if (getMode() !== "live" || client) return;
  const [isOwner, unmarked] = readOwner();
  owner = isOwner;
  if (owner) console.info("[analytics] owner mode: events are sent tagged is_owner=true (?me=0 to stop)");
  // loaded lazily so the SDK stays out of the initial page bundle
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(site.posthogKey, {
      api_host: site.posthogHost,
      capture_pageview: "history_change",
      autocapture: false,
      persistence: "localStorage",
      // runs for every event, including PostHog's own $pageview/$pageleave
      before_send: (event) => {
        if (!event) return event;
        event.properties = { ...event.properties, is_owner: owner };
        if (owner) console.info(`[analytics] sent ${event.event}`, event.properties);
        return event;
      },
      loaded: (ph) => {
        if (unmarked) ph.reset(); // drop the shared owner identity
        if (owner && ph.get_distinct_id() !== OWNER_ID) ph.identify(OWNER_ID, { is_owner: true });
      },
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
