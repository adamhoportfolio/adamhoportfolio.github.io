import { notFound } from "next/navigation";
import { getAllProjects, getProject, formatDate } from "@/lib/posts";
import Mdx from "@/components/Mdx";
import Video from "@/components/Video";
import HeadingLinks from "@/components/HeadingLinks";
import Clip from "@/components/Clip";
import LiveBadge from "@/components/LiveBadge";

export const dynamicParams = false; // required for static export

export function generateStaticParams() {
  return getAllProjects()
    .filter((p) => !p.external)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    openGraph: { title: p.title, description: p.summary, images: p.image ? [p.image] : [] },
  };
}

export default async function Project({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <article className="post">
      {p.video ? (
        <Video
          className="post-video"
          src={p.video}
          poster={p.image}
          title={p.title}
          caption={p.videoCaption || "Video TL;DR"}
        />
      ) : p.heroClip ? (
        <Clip className="post-image post-clip" src={p.heroClip} poster={p.image} label={p.title} />
      ) : p.image ? (
        <img className="post-image" src={p.image} alt="" />
      ) : null}
      <h1 className="post-title">{p.title}</h1>
      <p className="byline center">
        {formatDate(p.date)} <span>In</span> {p.category} <span>·</span> {p.readingMinutes} min read
        {p.liveRelease ? <>{" "}<LiveBadge release={p.liveRelease} /></> : null}
      </p>
      <div className="prose">
        <Mdx source={p.content} format={p.format} />
        <HeadingLinks />
      </div>
    </article>
  );
}
