import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>{new Date().getFullYear()}</p>
      <div className="social">
        <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <img src="/images/github-white.svg" width="30" height="30" alt="" />
        </a>
        <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <img src="/images/linkedin-white.svg" width="30" height="30" alt="" />
        </a>
      </div>
    </footer>
  );
}
