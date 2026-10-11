import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import Mdx from "@/components/Mdx";

export const metadata = { title: "About" };

export default function About() {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "about.md"), "utf8");
  const { data, content } = matter(raw);
  return (
    <div className="about">
      {data.photo ? <img className="about-photo" src={data.photo} alt="Adam Ho" /> : null}
      <h1 className="page-title">{data.heading}</h1>
      <div className="prose">
        <Mdx source={content} />
      </div>
    </div>
  );
}
