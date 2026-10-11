import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Callout from "./Callout";

// .md files are parsed as plain markdown (safe for converted Webflow posts:
// characters like { } < > can't break the build). .mdx files can use <Callout>.
export default function Mdx({ source, format = "md" }) {
  return (
    <MDXRemote
      source={source}
      components={{ Callout }}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm], format } }}
    />
  );
}
