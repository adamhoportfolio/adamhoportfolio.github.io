import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Callout from "./Callout";
import Clip from "./Clip";
import Video from "./Video";

// .md files are parsed as plain markdown (safe for converted Webflow posts:
// characters like { } < > can't break the build). .mdx files can use <Callout>, <Video> and <Clip>.
export default function Mdx({ source, format = "md" }) {
  return (
    <MDXRemote
      source={source}
      components={{ Callout, Clip, Video }}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm], format } }}
    />
  );
}
