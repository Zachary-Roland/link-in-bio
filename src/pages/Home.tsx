import { useState, useEffect } from "react";
import { useLinks } from "../hooks/useLinks";
import { useSettings } from "../hooks/useSettings";
import LinkButton from "../components/LinkButton";
import YouTubeEmbed from "../components/YouTubeEmbed";

export default function Home() {
  const { links, loading: linksLoading } = useLinks();
  const { settings, loading: settingsLoading } = useSettings();
  const [minWait, setMinWait] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMinWait(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = linksLoading || settingsLoading || minWait;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-terminal-bg">
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
