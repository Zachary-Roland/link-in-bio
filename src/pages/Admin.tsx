import { Outlet, NavLink } from "react-router";
import { useAuthContext } from "../context/AuthContext";

export default function Admin() {
  const { logout } = useAuthContext();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">admin dashboard</h1>
        <button
          onClick={() => logout()}
          className="text-xs text-terminal-green-muted hover:text-terminal-green transition-colors"
        >
          logout
        </button>
      </div>
      <nav className="flex gap-4 mb-8 border-b border-terminal-green-faint pb-4">
        <NavLink
          to="/admin/links"
          className={({ isActive }) =>
            isActive ? "text-terminal-green font-bold" : "text-terminal-green-muted hover:text-terminal-green"
          }
        >
          links
        </NavLink>
        <NavLink
          to="/admin/shows"
          className={({ isActive }) =>
            isActive ? "text-terminal-green font-bold" : "text-terminal-green-muted hover:text-terminal-green"
          }
        >
          shows
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}
