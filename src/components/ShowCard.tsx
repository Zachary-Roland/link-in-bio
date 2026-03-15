import type { Show } from "../hooks/useShows";

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const date = show.date.toDate();
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="border border-terminal-green-faint rounded px-4 py-3 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-terminal-green">{formatted}</p>
        {show.billing && (
          <p className="text-sm text-terminal-green">{show.billing}</p>
        )}
        <p className="text-sm text-terminal-green-muted">
          {show.venue} — {show.city}
        </p>
      </div>
      {show.ticketUrl && (
        <a
          href={show.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs border border-terminal-green px-3 py-1 rounded text-terminal-green hover:bg-terminal-green-dim transition-colors whitespace-nowrap"
        >
          tickets
        </a>
      )}
    </div>
  );
}
