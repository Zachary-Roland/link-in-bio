import { NavLink } from "react-router";
import { navItems } from "../lib/navigation";
import { useAuthContext } from "../context/AuthContext";
import SocialIcons from "./SocialIcons";

export default function Sidebar() {
  const { user } = useAuthContext();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-terminal-green-faint bg-terminal-bg p-6 justify-between shrink-0">
      <div>
        <div className="text-terminal-green font-bold text-lg mb-6">
          zachary-roland
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-2 py-1.5 rounded text-sm transition-colors ${
                  isActive
                    ? "text-terminal-green font-bold cursor-blink"
                    : "text-terminal-green-muted hover:text-terminal-green"
                }`
              }
            >
              {({ isActive }) => (
                <span>
                  <span className="text-terminal-green-muted mr-1">
                    {isActive ? ">" : " "}
                  </span>
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-2 py-1.5 rounded text-sm transition-colors mt-4 ${
                  isActive
                    ? "text-terminal-green font-bold cursor-blink"
                    : "text-terminal-green-muted hover:text-terminal-green"
                }`
              }
            >
              {({ isActive }) => (
                <span>
                  <span className="text-terminal-green-muted mr-1">
                    {isActive ? ">" : " "}
                  </span>
                  ~/admin
                </span>
              )}
            </NavLink>
          )}
        </nav>
      </div>
      <SocialIcons className="mt-auto pt-6" />
    </aside>
  );
}
