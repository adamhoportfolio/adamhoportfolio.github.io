import Link from "next/link";

export default function NotFound() {
  return (
    <div className="about">
      <h1 className="page-title">Page not found</h1>
      <p className="prose" style={{ textAlign: "center" }}>
        <Link href="/">Back to projects</Link>
      </p>
    </div>
  );
}
