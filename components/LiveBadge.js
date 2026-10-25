"use client";
import { useEffect, useState } from "react";

// "● Live, data refreshed 6h ago" for posts about a running pipeline.
// `release` is "owner/repo@tag"; the time is the newest asset upload on that GitHub
// release. Shows nothing until it loads, or at all if the API can't be reached.
export default function LiveBadge({ release }) {
  const [ago, setAgo] = useState(null);

  useEffect(() => {
    const [repo, tag] = release.split("@");
    let cancelled = false;
    fetch(`https://api.github.com/repos/${repo}/releases/tags/${tag}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rel) => {
        const latest = Math.max(...rel.assets.map((a) => Date.parse(a.updated_at)));
        if (!cancelled && Number.isFinite(latest)) setAgo(since(latest));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [release]);

  if (!ago) return null;
  return (
    <>
      <span>·</span> <span className="live"><span className="live-dot" aria-hidden="true" />Live, data refreshed {ago}</span>
    </>
  );
}

function since(ms) {
  const h = Math.floor((Date.now() - ms) / 3_600_000);
  if (h < 1) return "under an hour ago";
  if (h < 48) return `${h}h ago`;
  return `${Math.floor(h / 24)} days ago`;
}
