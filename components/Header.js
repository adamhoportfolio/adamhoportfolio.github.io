import Link from "next/link";
import { site } from "@/lib/site";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="nav" aria-label="Main">
        <Link href="/">Projects</Link>
        <Link href="/about/">About</Link>
        <a href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      </nav>
      <Link href="/" className="site-name">{site.name}</Link>
      <p className="site-tagline">{site.tagline}</p>
    </header>
  );
}
