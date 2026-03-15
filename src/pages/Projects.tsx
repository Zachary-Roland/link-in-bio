import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    name: "Project Name Here",
    description: "A brief description of the project and what it does.",
    tech: ["React", "TypeScript", "Firebase"],
    url: "https://example.com",
  },
  // TODO: Zachary to add real projects
];

export default function Projects() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8">~/projects</h1>
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </div>
  );
}
