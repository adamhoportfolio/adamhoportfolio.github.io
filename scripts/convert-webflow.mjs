// Convert an exported Webflow site into content/projects/*.md
// Usage: node scripts/convert-webflow.mjs <path-to-old-site> [--force]
//    or: node scripts/convert-webflow.mjs --file <post.html> [--force]   (one post, no index.html needed)
//   <path-to-old-site> must contain index.html and blog-posts/<slug>.html
// Existing files in content/projects are skipped unless --force is passed.
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const [, , oldDir, flag] = process.argv;
if (!oldDir) {
  console.error("usage: node scripts/convert-webflow.mjs <path-to-old-site> [--force]\n   or: node scripts/convert-webflow.mjs --file <post.html> [--force]");
  process.exit(1);
}
const FILE_MODE = oldDir === "--file";
const force = flag === "--force" || process.argv[4] === "--force";
const OUT = path.join(process.cwd(), "content", "projects");
fs.mkdirSync(OUT, { recursive: true });

const MONTHS = ["january","february","march","april","may","june","july","august","september","october","november","december"];
function isoDate(text) {
  const m = text.trim().match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (!m) return null;
  const mo = MONTHS.indexOf(m[1].toLowerCase());
  if (mo < 0) return null;
  return `${m[3]}-${String(mo + 1).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}
const fixSrc = (s = "") => s.replace(/^(\.\.\/|\.\/)+/, "/").replace(/^images\//, "/images/");

const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
td.use(gfm);

// Wrap ASCII diagrams (lines with box-drawing chars) in a code fence.
// The line just before the box lines (e.g. "A → B → C") is pulled into the fence.
function fenceDiagrams(md) {
  const blocks = md.split(/\n{2,}/);
  const box = (b) => /[└┘┌┐│─┴┬↑↓]/.test(b);
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    if (box(blocks[i])) {
      const run = [];
      const prev = out[out.length - 1];
      if (prev && prev.includes("→") && !prev.trimEnd().endsWith(".") && !prev.startsWith("```")) run.push(out.pop());
      while (i < blocks.length && box(blocks[i])) run.push(blocks[i++]);
      i--;
      out.push("```\n" + run.join("\n") + "\n```");
    } else out.push(blocks[i]);
  }
  return out.join("\n\n");
}

const q = (s) => JSON.stringify(s); // JSON strings are valid YAML

if (FILE_MODE) {
  // Single post: read metadata from the post page itself.
  const file = flag;
  if (!file || !fs.existsSync(file)) { console.error(`file not found: ${file}`); process.exit(1); }
  const slug = path.basename(file, ".html");
  const target = path.join(OUT, `${slug}.md`);
  if (fs.existsSync(target) && !force) { console.log(`skip (exists)  ${slug}  (add --force to overwrite)`); process.exit(0); }
  const $ = cheerio.load(fs.readFileSync(file, "utf8"));
  const rt = $(".blog-content.w-richtext").first();
  if (!rt.length) { console.error("no .blog-content.w-richtext found: not a Webflow post page?"); process.exit(1); }
  rt.find("p").each((_, p) => { if (!$(p).text().replace(/[\u200b-\u200d\uFEFF\s]/g, "") && !$(p).find("img").length) $(p).remove(); });
  rt.find("[role]").removeAttr("role");
  rt.find("img").each((_, im) => { $(im).attr("src", fixSrc($(im).attr("src"))).removeAttr("srcset").removeAttr("sizes"); });
  if (rt.find("iframe, .w-embed").length) console.warn(`EMBED FOUND    ${slug}: iframes/embeds are dropped; re-add by hand`);
  const body = fenceDiagrams(td.turndown(rt.html() || "")).trim() + "\n";
  const title = $(".post-heading").first().text().trim();
  const date = isoDate($(".byline-text").first().text()) || "2024-01-01";
  const category = $(".byline-link").first().text().trim();
  const image = fixSrc($("img.main-image").attr("src"));
  const firstP = rt.find("p").first().text().trim().replace(/\s+/g, " ");
  const summary = (firstP.length > 200 ? firstP.slice(0, 197).replace(/\s+\S*$/, "") + "..." : firstP) || title;
  const fm = ["---", `title: ${q(title)}`, `date: ${q(date)}`, `category: ${q(category)}`, `summary: ${q(summary)}`, `image: ${q(image)}`, "---", ""].join("\n");
  fs.writeFileSync(target, fm + body);
  console.log(`wrote ${slug}.md\nREVIEW: title, date (post pages can show a different date than the card), summary (auto-taken from the first paragraph), image path.`);
  process.exit(0);
}

const idx = cheerio.load(fs.readFileSync(path.join(oldDir, "index.html"), "utf8"));
const items = idx(".blog-post").toArray().map((el) => {
  const $el = idx(el);
  const href = $el.find("a.link-to-page").attr("href") || "";
  return {
    title: $el.find(".blog-headline").text().trim(),
    date: isoDate($el.find(".byline-text").first().text()),
    category: $el.find(".byline-link").first().text().trim(),
    summary: $el.find("p.blog-content").text().trim(),
    image: fixSrc($el.find("img.main-image").attr("src")),
    href,
  };
});

let written = 0;
for (const it of items) {
  const external = /^https?:/.test(it.href);
  const slug = external
    ? it.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : it.href.replace(/\/$/, "").split("/").pop();
  const target = path.join(OUT, `${slug}.md`);
  if (fs.existsSync(target) && !force) { console.log(`skip (exists)  ${slug}`); continue; }

  let body = "";
  if (!external) {
    const file = path.join(oldDir, "blog-posts", `${slug}.html`);
    if (!fs.existsSync(file)) { console.warn(`MISSING HTML   ${slug}  (expected ${file})`); continue; }
    const $ = cheerio.load(fs.readFileSync(file, "utf8"));
    const rt = $(".blog-content.w-richtext").first();
    rt.find("p").each((_, p) => { if (!$(p).text().replace(/[\u200b-\u200d\uFEFF\s]/g, "") && !$(p).find("img").length) $(p).remove(); });
    rt.find("[role]").removeAttr("role");
    rt.find("img").each((_, im) => { $(im).attr("src", fixSrc($(im).attr("src"))).removeAttr("srcset").removeAttr("sizes"); });
    if (rt.find("iframe, .w-embed").length) console.warn(`EMBED FOUND    ${slug}: iframes/embeds are dropped; re-add by hand`);
    body = fenceDiagrams(td.turndown(rt.html() || "")).trim() + "\n";
  }

  const fm = [
    "---",
    `title: ${q(it.title)}`,
    `date: ${q(it.date || "2024-01-01")}`,
    `category: ${q(it.category)}`,
    `summary: ${q(it.summary)}`,
    `image: ${q(it.image)}`,
    ...(external ? [`external: ${q(it.href)}`] : []),
    "---",
    "",
  ].join("\n");
  fs.writeFileSync(target, fm + body);
  console.log(`wrote          ${slug}${external ? "  (external link)" : ""}`);
  written++;
}
console.log(`\n${written} file(s) written to content/projects. Review each one, then run: npm run check`);
