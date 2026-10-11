# Portfolio (Next.js + Markdown, static export)

Add a project = add one file in `content/projects/`, push to `main`. Done.

## Add a project
Create `content/projects/my-slug.md` (or `.mdx` to use `<Callout>`):

    ---
    title: "Project title"
    date: "2026-10-11"          # ISO format, controls sort order
    category: "A/B Testing"
    summary: "One or two sentences for the card."
    image: "/images/my-thumb.png"   # file goes in public/images/
    external: "https://..."     # optional: card links off-site instead of a page
    ---
    Body in markdown.

URL becomes `/blog-posts/my-slug/` (same pattern as the old site, so old links keep working).

## First-time setup (in order)
1. Check out the OLD site into a separate folder (e.g. `../old-site`). You need its `index.html` and `blog-posts/`.
2. In your repo: `git checkout -b restructure`. Delete the old `css/`, `js/`, `*.html`, `blog-posts/`. KEEP `images/`.
3. Copy this project's files into the repo root. Move `images/` to `public/images/`.
4. `npm install`
5. `npm run convert -- ../old-site` converts every old post to `content/projects/*.md`.
   Existing files are skipped; add `--force` to overwrite.
6. Replace every `TODO` in `content/projects/spotify-smart-queue-ab-test.mdx` (Notion, tracking plan, Vercel mockup, Mixpanel screenshot). Add `public/images/smart-queue-thumb.png`.
7. `npm run check` lists every remaining problem (TODOs, missing images, bad internal links).
8. `npm run dev`, review at http://localhost:3000. Then `npm run build` (output in `out/`).
9. Push the branch, open a PR, merge to `main`.
10. GitHub repo, Settings, Pages: set Source to **GitHub Actions** (one time). `.github/workflows/deploy.yml` then deploys on every push to `main`.
11. Open the live URL in incognito. Click every link.

## Notes
- URL stays `https://<username>.github.io`. No DNS change, resume link unchanged.
- The repo must be named `<username>.github.io` to serve at the root.
- CI sets `CI=true`, so the build FAILS on any TODO or missing image. Locally it only warns.
- Site-wide text (name, tagline, links): `lib/site.js`. About page: `content/about.md`.
- Vercel also works unchanged: import the repo, framework Next.js. (Hobby plan is non-commercial.)
- Skim every converted `.md` for oddities (code blocks, tables). The converter warns about dropped iframes.
