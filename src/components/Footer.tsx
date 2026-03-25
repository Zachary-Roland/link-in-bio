import { Link, useLocation } from "react-router";
import SocialIcons from "./SocialIcons";

export default function Footer() {
  const { pathname } = useLocation();

  return (
    <footer className="border-t border-terminal-green-faint md:mt-auto px-4 py-6 pb-20 md:pb-6">
      <div className="flex flex-col items-center gap-4">
        {/* Social icons: visible on mobile, hidden on desktop (sidebar has them) */}
        <SocialIcons className="md:hidden" />
        {pathname !== "/contact" && (
          <Link
            to="/contact"
            className="text-sm border border-terminal-green px-4 py-1 rounded hover:bg-terminal-green hover:text-terminal-bg transition-colors"
          >
            Contact Me
          </Link>
        )}
        <p className="text-xs text-terminal-green-muted">
          &copy; {new Date().getFullYear()} Zachary Roland
        </p>
      </div>
    </footer>
  );
}
