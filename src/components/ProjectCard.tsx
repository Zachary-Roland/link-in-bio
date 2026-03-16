interface ProjectCardProps {
  name: string;
  description: string;
  tech: string[];
  url: string;
  liveUrl?: string;
}

export default function ProjectCard({
  name,
  description,
  tech,
  url,
  liveUrl,
}: ProjectCardProps) {
  return (
    <div className="border border-terminal-green-faint rounded p-4">
      <h3 className="font-bold text-terminal-green">
        {liveUrl ? (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {name}
          </a>
        ) : (
          name
        )}
      </h3>
      <p className="text-sm text-terminal-green-muted mt-1">{description}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {tech.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 border border-terminal-green-faint rounded text-terminal-green-muted"
          >
            {t}
          </span>
        ))}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-xs border border-terminal-green px-3 py-1 rounded text-terminal-green hover:bg-terminal-green-dim transition-colors"
      >
        view project
      </a>
    </div>
  );
}
