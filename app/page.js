import { getAllProjects } from "@/lib/posts";
import ProjectCard from "@/components/ProjectCard";

export default function Home() {
  const projects = getAllProjects();
  return (
    <div className="wrap">
      <h1 className="page-title">Explore my latest personal projects</h1>
      <div className="grid">
        {projects.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
}
