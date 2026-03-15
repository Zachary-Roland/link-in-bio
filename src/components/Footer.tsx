import SocialIcons from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-terminal-green-faint md:mt-auto px-4 py-6 pb-20 md:pb-6">
      <div className="flex flex-col items-center gap-4">
        {/* Social icons: visible on mobile, hidden on desktop (sidebar has them) */}
        <SocialIcons className="md:hidden" />
        <a
          href="mailto:zaroland95@gmail.com"
          className="text-sm text-terminal-green-muted hover:text-terminal-green transition-colors"
        >
          zaroland95@gmail.com
        </a>
        <p className="text-xs text-terminal-green-muted">
          &copy; {new Date().getFullYear()} Zachary Roland
        </p>
      </div>
    </footer>
  );
}
