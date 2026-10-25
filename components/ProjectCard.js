import Link from "next/link";
import { formatDate } from "@/lib/posts";
import Clip from "./Clip";

export default function ProjectCard({ p, position }) {
  const href = p.external || `/blog-posts/${p.slug}/`;
  const ext = Boolean(p.external);
  const linkProps = ext ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const Anchor = ext ? "a" : Link;
  // read by the click listener in components/Analytics.js
  const trackProps = (target) => ({
    "data-track": "project_click",
    "data-track-slug": p.slug,
    "data-track-title": p.title,
    "data-track-category": p.category,
    "data-track-position": position,
    "data-track-target": target,
    "data-track-external": ext,
  });

  return (
    <article className="card">
      <Anchor href={href} {...linkProps} className="card-image" aria-hidden="true" tabIndex={-1} {...trackProps("image")}>
        {p.heroClip ? (
          <Clip className="card-clip" src={p.heroClip} poster={p.image} label="" />
        ) : p.image ? (
          <img src={p.image} alt="" loading="lazy" />
        ) : (
          <span className="card-noimg" />
        )}
      </Anchor>
      <h2 className="card-title">{p.title}</h2>
      <p className="byline">
        {formatDate(p.date)} <span>In</span> {p.category}
      </p>
      <p className="card-summary">{p.summary}</p>
      <Anchor href={href} {...linkProps} className="card-more" {...trackProps("read_more")}>
        Read more<span className="sr-only">: {p.title}</span>
      </Anchor>
    </article>
  );
}
