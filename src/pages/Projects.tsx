import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    name: "Roland J-6 Chord Engine",
    description:
      "Companion app for the Roland AIRA J-6 Chord Synth — browse chord sets, discover progressions, build sequences.",
    tech: ["React", "TypeScript", "Firebase"],
    url: "https://github.com/Zachary-Roland/roland-j6-chord-engine",
    liveUrl: "https://roland-j6-chord-guide.web.app/",
  },
  {
    name: "zacharyroland.dev",
    description:
      "Terminal-inspired personal site with a link-in-bio home page, upcoming shows, music, projects, and more.",
    tech: ["React", "TypeScript", "Firebase"],
    url: "https://github.com/Zachary-Roland/zacharyroland.dev",
  },
  {
    name: "MyGarms",
    description:
      "Closet inventory management app with outfit planning. Full-stack with a separate React frontend and Express/MongoDB backend.",
    tech: ["React", "Express", "MongoDB"],
    url: "https://github.com/Zachary-Roland/closet-app-react",
  },
  {
    name: "Solitaire",
    description:
      "A solitaire card game built with React, React Router, Express, and MongoDB.",
    tech: ["React", "Express", "MongoDB"],
    url: "https://github.com/Zachary-Roland/solitaire",
  },
  {
    name: "Blackjack",
    description:
      "Recreation of an iOS Blackjack game in vanilla JavaScript.",
    tech: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/Zachary-Roland/Blackjack-Game",
  },
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
