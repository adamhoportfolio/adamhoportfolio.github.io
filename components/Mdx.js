import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Callout from "./Callout";
import Clip from "./Clip";
import Flow from "./Flow";
import PhaseNav from "./PhaseNav";
import Slides, { Slide } from "./Slides";
import Toggle, { Pane } from "./Toggle";
import Video from "./Video";
import ZoomImg from "./ZoomImg";

// .md files are parsed as plain markdown (safe for converted Webflow posts:
// characters like { } < > can't break the build). .mdx files can also use <Callout>, <Video>, <Clip>,
// <Slides>, <Toggle>, <PhaseNav> and <Flow>. Images in both formats can be clicked to enlarge.
export default function Mdx({ source, format = "md" }) {
  return (
    <MDXRemote
      source={source}
      components={{ Callout, Clip, Flow, Pane, PhaseNav, Slide, Slides, Toggle, Video, img: ZoomImg }}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm], format } }}
    />
  );
}
