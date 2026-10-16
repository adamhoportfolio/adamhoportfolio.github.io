// Content safety check. Runs before every build.
// Locally: prints warnings. In CI (CI=true): fails the build.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const dir = path.join(root, "content");
const problems = [];

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
}

const slugs = new Set(
  fs.readdirSync(path.join(dir, "projects")).map((f) => f.replace(/\.mdx?$/, "")),
);

for (const file of walk(dir)) {
  if (!/\.mdx?$/.test(file)) continue;
  const rel = path.relative(root, file);
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);

  if (/TODO/.test(raw)) problems.push(`${rel}: contains TODO placeholder`);
  if (rel.includes("projects")) {
    for (const k of ["title", "date", "category", "summary"])
      if (!data[k]) problems.push(`${rel}: missing frontmatter "${k}"`);
  }
  // local image files must exist in /public
  const imgs = [data.image, data.photo, ...[...raw.matchAll(/\]\((\/images\/[^)\s]+)\)/g)].map((m) => m[1])].filter(Boolean);
  for (const img of imgs)
    if (img.startsWith("/") && !fs.existsSync(path.join(root, "public", img)))
      problems.push(`${rel}: image not found: public${img}`);
  // local video files must exist and stay under GitHub's 100 MB file limit
  const vids = [data.video, ...[...raw.matchAll(/src="(\/videos\/[^"]+)"/g)].map((m) => m[1])].filter(Boolean);
  for (const vid of vids) {
    if (!vid.startsWith("/")) continue;
    const f = path.join(root, "public", vid);
    if (!fs.existsSync(f)) problems.push(`${rel}: video not found: public${vid}`);
    else if (fs.statSync(f).size > 90 * 1024 * 1024) problems.push(`${rel}: video over 90 MB (GitHub rejects >100 MB): public${vid}`);
  }
  // internal project links must resolve
  for (const m of raw.matchAll(/\]\(\/blog-posts\/([^/)\s]+)\/?\)/g))
    if (!slugs.has(m[1])) problems.push(`${rel}: link to unknown project: ${m[1]}`);
}

if (problems.length) {
  console.log(`\ncontent check: ${problems.length} problem(s)\n` + problems.map((p) => `  - ${p}`).join("\n") + "\n");
  if (process.env.CI) process.exit(1);
} else console.log("content check: ok");
