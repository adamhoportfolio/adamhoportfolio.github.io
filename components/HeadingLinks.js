"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Adds a "#" button to every post heading that has an id. Clicking it copies a link
// straight to that section (handy for sending someone to one part of a post).
export default function HeadingLinks() {
  useEffect(() => {
    const added = [];
    for (const h of document.querySelectorAll(".prose h2[id]")) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "heading-link";
      b.textContent = "#";
      b.setAttribute("aria-label", `Copy link to “${h.textContent}”`);
      b.addEventListener("click", async () => {
        const url = `${location.origin}${location.pathname}#${h.id}`;
        history.replaceState(null, "", `#${h.id}`);
        try {
          await navigator.clipboard.writeText(url);
          b.dataset.copied = "";
          setTimeout(() => delete b.dataset.copied, 1500);
        } catch {} // clipboard blocked: the address bar still has the link
        track("section_link_copy", { section: h.id, page_slug: location.pathname });
      });
      h.append(b);
      added.push(b);
    }
    return () => added.forEach((b) => b.remove());
  }, []);
  return null;
}
