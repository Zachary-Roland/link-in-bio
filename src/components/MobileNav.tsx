import { useState } from "react";
import { NavLink } from "react-router";
import { navItems } from "../lib/navigation";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="md:hidden border-b border-terminal-green-faint">
      <div className="flex items-center justify-between px-4 py-3">
        <NavLink to="/" className="text-terminal-green font-bold text-lg">
          zachary-roland
        </NavLink>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-terminal-green p-1"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
            {isOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {isOpen && (
        <nav className="px-4 pb-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-2 py-2 rounded text-sm transition-colors ${
                  isActive
                    ? "text-terminal-green font-bold"
                    : "text-terminal-green-muted hover:text-terminal-green"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
