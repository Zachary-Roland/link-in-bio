interface LinkButtonProps {
  label: string;
  url: string;
}

export default function LinkButton({ label, url }: LinkButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full max-w-md px-6 py-3 border border-terminal-green text-terminal-green text-center rounded transition-all hover:bg-terminal-green-dim hover:shadow-[0_0_15px_rgba(74,246,134,0.15)]"
    >
      {label}
    </a>
  );
}
