import { useState, type MouseEvent } from "react";

interface LinkButtonProps {
  label: string;
  url: string;
}

export default function LinkButton({ label, url }: LinkButtonProps) {
  const [tapped, setTapped] = useState(false);

  function handleClick(e: MouseEvent) {
    // Only animate on touch/mobile — skip if hover is supported
    if (window.matchMedia("(hover: hover)").matches) return;

    e.preventDefault();
    setTapped(true);
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
      setTapped(false);
    }, 400);
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="relative block w-full max-w-md px-6 py-3 border border-terminal-green text-terminal-green text-center rounded transition-all overflow-hidden hover:bg-terminal-green-dim hover:shadow-[0_0_15px_rgba(74,246,134,0.15)]"
    >
      <span
        className={`absolute inset-0 bg-terminal-green-dim origin-left ${
          tapped ? "animate-link-fill" : "scale-x-0"
        }`}
      />
      <span className="relative">{label}</span>
    </a>
  );
}
