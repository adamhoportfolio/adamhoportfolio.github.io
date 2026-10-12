import Link from "next/link";
import { site } from "@/lib/site";
import DecodeText from "./DecodeText";
import RotatingTagline from "./RotatingTagline";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main">
        <Link href="/">Projects</Link>
        <Link href="/about/">About</Link>
        <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={site.resume} target="_blank" rel="noopener noreferrer">Resume</a>
      </nav>
      <Link href="/" className="site-name"><DecodeText text={site.name} /></Link>
      <RotatingTagline items={site.taglines ?? [site.tagline]} />
    </header>
  );
}
