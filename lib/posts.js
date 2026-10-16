import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content", "projects");

function toIso(d) {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d);
}

function read(file) {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const ext = path.extname(file);
  return {
    slug: path.basename(file, ext),
    format: ext === ".mdx" ? "mdx" : "md",
    title: data.title,
    date: toIso(data.date),
    category: data.category || "",
    summary: data.summary || "",
    image: data.image || "",
    video: data.video || "", // shown in place of the hero image on the post page
    videoCaption: data.videoCaption || "",
    external: data.external || "", // set to send the card to another site
    content,
    draft: Boolean(data.draft),
  };
}

export function getAllProjects() {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map(read)
    .filter((p) => !p.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getProject(slug) {
  return getAllProjects().find((p) => p.slug === slug);
}

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
