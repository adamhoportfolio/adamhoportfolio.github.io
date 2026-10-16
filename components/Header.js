import Link from "next/link";
import { site } from "@/lib/site";
import DecodeText from "./DecodeText";
import RotatingTagline from "./RotatingTagline";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main">
        <Link href="/" data-track="nav_click" data-track-item="projects">Projects</Link>
        <Link href="/about/" data-track="nav_click" data-track-item="about">About</Link>
        <a href={site.github} target="_blank" rel="noopener noreferrer" data-track="nav_click" data-track-item="github">GitHub</a>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer" data-track="nav_click" data-track-item="linkedin">LinkedIn</a>
        <a href={site.resume} target="_blank" rel="noopener noreferrer" data-track="nav_click" data-track-item="resume">Resume</a>
      </nav>
      <Link href="/" className="site-name" data-track="nav_click" data-track-item="home_logo"><DecodeText text={site.name} /></Link>
      <RotatingTagline items={site.taglines ?? [site.tagline]} />
    </header>
  );
}
