import { NavLink } from "react-router";
import { navItems } from "../lib/navigation";

export default function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-terminal-green-faint bg-terminal-bg">
      <div className="flex items-center justify-around px-2 py-2.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `text-xs px-2 py-1 rounded transition-colors ${
                isActive
                  ? "text-terminal-green font-bold"
                  : "text-terminal-green-muted"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
