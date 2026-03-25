import { useState, useEffect } from "react";
import { useLinks } from "../hooks/useLinks";
import { useShows } from "../hooks/useShows";
import { useSettings } from "../hooks/useSettings";
import LinkButton from "../components/LinkButton";
import ShowCard from "../components/ShowCard";
import YouTubeEmbed from "../components/YouTubeEmbed";

export default function Home() {
  const { links, loading: linksLoading } = useLinks();
  const { upcomingShows, loading: showsLoading } = useShows();
  const { settings, loading: settingsLoading } = useSettings();
  const [minWait, setMinWait] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinWait(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = linksLoading || showsLoading || settingsLoading || minWait;
  const nextShow = upcomingShows[0];

  if (isLoading) {
    return (
      <div role="status" aria-live="polite" className="fixed inset-0 z-[9998] flex items-center justify-center bg-terminal-bg">
        <span className="text-terminal-green-muted loading-dots">loading</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 md:py-12 px-4 gap-4">
      <img
        src="/profile.jpg"
        alt="Zachary Roland"
        className="w-28 h-28 rounded-2xl mb-4"
      />
      <h1 className="text-2xl font-bold">Zachary Roland</h1>
      <p className="text-terminal-green-muted mb-4 text-center text-sm sm:text-base">
        developer // fashion designer // musician
      </p>

      {nextShow && (
        <div className="w-full max-w-md">
          <p className="text-xs text-terminal-green-muted mb-2">next show</p>
          <ShowCard show={nextShow} />
        </div>
      )}

      {links.map((link) => (
        <LinkButton key={link.id} label={link.label} url={link.url} />
      ))}

      {links.length === 0 && (
        <p className="text-sm text-terminal-green-muted">No links yet.</p>
      )}

      {settings.youtubeEnabled && settings.youtubeUrl && (
        <div className="mt-2">
          <YouTubeEmbed url={settings.youtubeUrl} />
        </div>
      )}
    </div>
  );
}
