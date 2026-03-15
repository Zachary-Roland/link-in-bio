import { useShows } from "../hooks/useShows";
import ShowCard from "../components/ShowCard";

const bands = [
  {
    name: "Band Name Here",
    role: "Guitar / Vocals",
    description:
      "A brief description of the band and what kind of music they play.",
    streamingLink: "https://example.com/band-link",
  },
  // TODO: Zachary to add real band profiles
];

export default function Music() {
  const { upcomingShows, loading } = useShows();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8">~/music</h1>

      {/* Band Profiles */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-terminal-green-muted">
          bands
        </h2>
        <div className="space-y-6">
          {bands.map((band) => (
            <div
              key={band.name}
              className="border border-terminal-green-faint rounded p-4"
            >
              <h3 className="font-bold text-terminal-green">{band.name}</h3>
              <p className="text-sm text-terminal-green-muted mt-1">
                {band.role}
              </p>
              <p className="text-sm text-terminal-green-muted mt-2">
                {band.description}
              </p>
              <a
                href={band.streamingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs border border-terminal-green px-3 py-1 rounded text-terminal-green hover:bg-terminal-green-dim transition-colors"
              >
                listen
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Shows */}
      <section>
        <h2 className="text-lg font-bold mb-4 text-terminal-green-muted">
          upcoming shows
        </h2>
        {loading ? (
          <p className="text-sm text-terminal-green-muted">loading...</p>
        ) : upcomingShows.length === 0 ? (
          <p className="text-sm text-terminal-green-muted">
            No upcoming shows.
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
