/** @type {import('next').NextConfig} */
export default {
  output: "export",        // static HTML in /out (GitHub Pages or Vercel)
  trailingSlash: true,     // /about/ -> about/index.html (works on GitHub Pages)
  images: { unoptimized: true },
};
