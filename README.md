# Adam Ho portfolio

Live: https://adamhoportfolio.github.io
Stack: Next.js static export, markdown posts, deployed by GitHub Actions to GitHub Pages.

Pushing to `main` publishes the site (about 1-2 minutes).

---

## Add a new post

A post is one text file in `content/projects/`. No HTML, no code edits. The card on the home page, the post page, and the sort order are all generated from that file.

### 1. Write the file

Filename = URL. `my-new-post.md` becomes `/blog-posts/my-new-post/`.
Use lowercase, hyphens, no spaces.

```
---
title: "Project title"
date: "2026-11-02"
category: "A/B Testing"
summary: "One or two sentences. Shown on the card and in link previews."
image: "/images/my-new-post-thumb.png"
---
## Section heading

Body text in markdown. **Bold**, lists, tables, `code`, and images all work.

![Alt text](/images/my-new-post-chart.png)
```

Rules:
- Wrap `title` and `summary` in double quotes. A colon without quotes breaks the file.
- `date` must be `YYYY-MM-DD`. Newest date shows first.
- `category` is free text.
- Start body headings at `##`. The title is already the page heading.

Variants:
- **Card that links off-site** (Notion, Deepnote, etc.): add `external: "https://..."` to the header. The body can be empty and no page is generated.
- **Warning box:** name the file `.mdx` instead of `.md`, then use `<Callout title="Heads up">text</Callout>`. Use this for the simulated-data notice on simulated projects.
- Plain `.md` files can't use `<Callout>`.

### 2. Add images

- Put files in `public/images/`. Reference them as `/images/name.png`, with no `public` in the path.
- Thumbnails are cropped to 3:2. Aim for 1200x800 and under 500KB.
- Lowercase names, no spaces.

### 3. Publish (pick one)

**A. In the browser (no terminal)**
1. Go to the repo on github.com, open `content/projects/`.
2. Add file, then Create new file. Type the filename, paste the contents.
3. For images: open `public/images/`, Add file, then Upload files.
4. Commit directly to `main`.

**B. Locally in VS Code (lets you preview first)**
```
git checkout main
git pull
# create the .md file and add images, then:
npm run dev        # preview at http://localhost:3000
npm run check      # lists TODOs, missing images, bad links
git add .
git commit -m "Add post: my-new-post"
git push
```

### 4. Verify
- Repo, Actions tab: the latest run should be green (1-2 minutes).
- Open the live URL in an incognito window. Click the new card and every link in it.
- If the run is red, open it and read the error. Common causes:
  - a `TODO` left in a file
  - an image path that doesn't exist in `public/images/`
  - quotes missing in the header
- A failed build never replaces the live site. The old version stays up.

### Using Claude to draft a post
Paste this with your notes:

> Write a markdown post for my portfolio. Output only the file contents: a header with title, date, category, summary, image (format below), then the body using `##` headings. No HTML. Header format: [paste the block from step 1].

Review the output before publishing. It must not claim anything the project doesn't show.

---

## Edit or remove a post
- Edit: open the file in `content/projects/`, change it, commit.
- Remove: delete the file, commit. The old URL will 404.
- Hide without deleting: move the file out of `content/projects/`.

## Site-wide text
- Name, tagline, GitHub and LinkedIn links, site URL: `lib/site.js`
- About page: `content/about.md`
- Colors and fonts: top of `app/globals.css`

## Rules to remember
- Never commit `node_modules`, `.next`, `out`, or `old-site` (listed in `.gitignore`).
- Simulated or fictional data must say so near the top of the post.
- Don't paste API tokens or keys into any file. This repo is public.
- Run `npm install` once after cloning on a new machine.
