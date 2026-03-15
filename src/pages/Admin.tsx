import { Outlet, NavLink } from "react-router";

export default function Admin() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-xl font-bold mb-4">admin dashboard</h1>
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
