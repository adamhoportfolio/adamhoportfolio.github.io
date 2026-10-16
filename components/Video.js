"use client";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

// Video player that reports viewing behavior.
// Use in .mdx posts:  <Video src="/videos/clip.mp4" poster="/images/clip.jpg" title="..." caption="..." />
// The caption gets the video length appended once metadata loads, e.g. "Video TL;DR (3:44)".
// or set `video:` in a post's frontmatter to show it in place of the hero image.
//
// Events: video_impression, video_play, video_progress (10% buckets, actually
// played, so seeking ahead doesn't count), video_seek, video_ended, and one
// video_session summary when the page is hidden/closed.
export default function Video({ src, poster, title, caption, id, className }) {
  const ref = useRef(null);
  const [length, setLength] = useState("");
  const videoId = id || src.split("/").pop().replace(/\.[^.]+$/, "");

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    const s = { plays: 0, seeks: 0, buckets: new Set(), seekFrom: 0, lastTime: 0, sent: false };
    const base = () => ({
      video_id: videoId,
      duration: Math.round(v.duration || 0),
      page_slug: window.location.pathname,
    });

    // Furthest point reached by continuous playback from the start
    // (end of the played range that begins at ~0).
    const contiguousEnd = () => {
      for (let i = 0; i < v.played.length; i++)
        if (v.played.start(i) <= 1) return v.played.end(i);
      return 0;
    };
    const watchedSeconds = () => {
      let t = 0;
      for (let i = 0; i < v.played.length; i++) t += v.played.end(i) - v.played.start(i);
      return t;
    };

    const onPlay = () => {
      s.plays += 1;
      track("video_play", { ...base(), is_first_play: s.plays === 1, position: Math.round(v.currentTime) });
    };
    const onTime = () => {
      if (!v.seeking) s.lastTime = v.currentTime;
      if (!v.duration) return;
      const pct = Math.floor((contiguousEnd() / v.duration) * 10) * 10;
      for (let p = 10; p <= Math.min(pct, 100); p += 10) {
        if (s.buckets.has(p)) continue;
        s.buckets.add(p);
        track("video_progress", { ...base(), percent: p });
      }
    };
    const onSeeking = () => { s.seekFrom = s.lastTime; };
    const onSeeked = () => {
      s.seeks += 1;
      track("video_seek", { ...base(), from: Math.round(s.seekFrom), to: Math.round(v.currentTime) });
      s.lastTime = v.currentTime;
    };
    const onEnded = () => track("video_ended", base());
    const onMeta = () => {
      const d = Math.floor(v.duration || 0); // floor, to match the player's own clock
      if (d) setLength(`${Math.floor(d / 60)}:${String(d % 60).padStart(2, "0")}`);
    };
    if (v.readyState >= 1) onMeta();

    const sendSession = () => {
      if (s.sent || s.plays === 0) return;
      s.sent = true;
      let maxPos = 0;
      for (let i = 0; i < v.played.length; i++) maxPos = Math.max(maxPos, v.played.end(i));
      const watched = watchedSeconds();
      track("video_session", {
        ...base(),
        watched_seconds: Math.round(watched),
        max_position: Math.round(maxPos),
        completion_pct: v.duration ? Math.round((contiguousEnd() / v.duration) * 100) : 0,
        seek_count: s.seeks,
        play_count: s.plays,
      }, { beacon: true });
    };
    const onVisibility = () => { if (document.visibilityState === "hidden") sendSession(); };

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track("video_impression", base());
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(v);

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("play", onPlay);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("seeking", onSeeking);
    v.addEventListener("seeked", onSeeked);
    v.addEventListener("ended", onEnded);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", sendSession);
    return () => {
      // client-side navigation away from the post also ends the session
      sendSession();
      io.disconnect();
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("seeking", onSeeking);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("ended", onEnded);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", sendSession);
    };
  }, [videoId]);

  return (
    <figure className={className ? `video-figure ${className}` : "video-figure"}>
      <video
        ref={ref}
        className="video"
        src={src}
        poster={poster || undefined}
        title={title}
        aria-label={title}
        controls
        preload="metadata"
        playsInline
      />
      {caption ? (
        <figcaption>
          {caption}
          {length ? ` (${length})` : ""}
        </figcaption>
      ) : null}
    </figure>
  );
}
