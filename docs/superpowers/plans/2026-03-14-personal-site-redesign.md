# Personal Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Zachary Roland's personal site from a CRA scaffold into a terminal-themed link-in-bio + personal site with React 19, Vite, TypeScript, Tailwind v4, React Router v7, and Firebase.

**Architecture:** SPA with client-side routing. Mobile: full-screen link-in-bio hub. Desktop: persistent terminal-styled sidebar with content area. Firebase provides Firestore for dynamic data (links, shows, settings) and Auth for admin access. All pages are lazy-loaded route chunks.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router v7 (client-side), Firebase (Hosting, Firestore, Auth), JetBrains Mono font

---

## File Structure

```
index.html                          # Vite entry HTML (replaces public/index.html)
vite.config.ts                      # Vite config with React plugin
tsconfig.json                       # TypeScript config
tsconfig.node.json                  # TS config for Vite/node files
postcss.config.js                   # PostCSS config for Tailwind
package.json                        # Dependencies and scripts
.firebaserc                         # Firebase project alias
firebase.json                       # Firebase hosting config
firestore.rules                     # Firestore security rules
firestore.indexes.json              # Firestore indexes (empty initially)

src/
  main.tsx                          # App entry — renders RouterProvider
  App.tsx                           # Root layout — sidebar + outlet
  index.css                         # Tailwind directives + scanline overlay + global styles
  vite-env.d.ts                     # Vite type declarations

  lib/
    firebase.ts                     # Firebase app init, Firestore/Auth exports
    navigation.ts                   # Shared nav items constant

  hooks/
    useLinks.ts                     # Firestore hook: fetch ordered links
    useShows.ts                     # Firestore hook: fetch upcoming shows
    useSettings.ts                  # Firestore hook: fetch home settings (YouTube toggle)
    useAuth.ts                      # Firebase Auth hook: login state + login/logout

  context/
    AuthContext.tsx                  # Auth provider wrapping admin routes

  components/
    Sidebar.tsx                     # Desktop terminal-style sidebar nav
    MobileNav.tsx                   # Mobile hamburger nav
    LinkButton.tsx                  # Styled link button (used on Home page)
    ShowCard.tsx                    # Show entry (date, venue, city, ticket link)
    ProjectCard.tsx                 # Project entry (name, desc, tech, link)
    Footer.tsx                      # Footer with contact + social icons
    SocialIcons.tsx                 # Reusable social icon links (GitHub, FB, IG, Bluesky)
    YouTubeEmbed.tsx                # Responsive YouTube iframe embed
    ProtectedRoute.tsx              # Auth guard — redirects to login if not authed

  pages/
    Home.tsx                        # Link-in-bio hub — dynamic links from Firestore
    About.tsx                       # Static bio page
    Music.tsx                       # Band profiles (static) + upcoming shows (dynamic)
    Projects.tsx                    # Static project showcase
    Admin.tsx                       # Admin layout with sub-navigation
    AdminLogin.tsx                  # Login form for admin
    AdminLinks.tsx                  # Links CRUD + drag-to-reorder + YouTube toggle
    AdminShows.tsx                  # Shows CRUD

  routes.tsx                        # Route definitions with lazy imports
```

---

## Chunk 1: Project Scaffold — Vite + React 19 + TypeScript + Tailwind v4 + React Router v7

This chunk replaces the CRA scaffold with Vite, installs all core dependencies, sets up Tailwind with the terminal theme, creates the root layout shell, and wires up React Router with placeholder pages. By the end, you can navigate between all routes with a working responsive layout.

### Task 1: Replace CRA with Vite + React 19 + TypeScript

**Files:**
- Delete: `src/App.js`, `src/App.css`, `src/App.test.js`, `src/index.js`, `src/index.css`, `src/logo.svg`, `src/reportWebVitals.js`, `src/setupTests.js`, `public/index.html`, `public/manifest.json`, `public/logo192.png`, `public/logo512.png`, `public/robots.txt`, `public/favicon.ico`
- Create: `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `src/main.tsx`, `src/vite-env.d.ts`
- Modify: `package.json`

- [ ] **Step 1: Remove CRA files and dependencies**

Delete all CRA-specific source files and the `public/` directory:

```bash
rm -rf src/* public/*
```

- [ ] **Step 2: Rewrite package.json for Vite + React 19**

Replace the entire `package.json` with:

```json
{
  "name": "link-in-bio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "~5.7.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 3: Create Vite config**

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 4: Create TypeScript configs**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: Create entry HTML**

Create `index.html` at the project root:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#1a1a2e" />
    <meta name="description" content="Zachary Roland — software engineer and musician" />
    <title>Zachary Roland</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create Vite type declarations**

Create `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 7: Create minimal main.tsx**

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function App() {
  return <h1>Hello Vite + React 19</h1>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 8: Install dependencies and verify dev server starts**

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev -- --port 3000 &
sleep 3
curl -s http://localhost:3000 | head -20
kill %1
```

Expected: HTML response containing the Vite entry point script tag.

- [ ] **Step 9: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: replace CRA scaffold with Vite + React 19 + TypeScript"
```

---

### Task 2: Add Tailwind CSS v4 with Terminal Theme

**Files:**
- Create: `src/index.css`, `postcss.config.js`
- Modify: `src/main.tsx`, `index.html`, `package.json`

Note: Tailwind v4 uses CSS-based configuration via `@theme` — no `tailwind.config.ts` needed.

- [ ] **Step 1: Install Tailwind CSS v4 and dependencies**

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

- [ ] **Step 2: Create PostCSS config**

Create `postcss.config.js`:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 3: Create global CSS with Tailwind v4 theme and scanline overlay**

Create `src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-terminal-bg: #1a1a2e;
  --color-terminal-green: #4af686;
  --color-terminal-green-muted: #4af68680;
  --color-terminal-green-faint: #4af68633;
  --color-terminal-green-dim: #4af68620;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    @apply bg-terminal-bg text-terminal-green font-mono antialiased;
    min-height: 100vh;
  }

  /* Scanline overlay — purely decorative (CSS pseudo-element, invisible to screen readers) */
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(74, 246, 134, 0.02) 0px,
      rgba(74, 246, 134, 0.02) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
    z-index: 9999;
  }

  /* Blinking cursor animation */
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .cursor-blink::after {
    content: "█";
    animation: blink 1s step-end infinite;
    margin-left: 2px;
  }
}
```

- [ ] **Step 4: Add JetBrains Mono and Inter font links to index.html**

Add to `<head>` in `index.html`, before the closing `</head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 5: Import CSS in main.tsx**

Update `src/main.tsx` to import the CSS:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-terminal-green">
        zachary-roland<span className="cursor-blink"></span>
      </h1>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 6: Verify dev server renders with Tailwind styles**

```bash
npm run dev -- --port 3000 &
sleep 3
curl -s http://localhost:3000 | head -20
kill %1
```

Expected: Page loads. Manually verify green text on dark background with scanline overlay.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind CSS v4 with terminal theme and scanline overlay"
```

---

### Task 3: React Router v7 + Route Definitions + Placeholder Pages

**Files:**
- Create: `src/routes.tsx`, `src/App.tsx`, `src/pages/Home.tsx`, `src/pages/About.tsx`, `src/pages/Music.tsx`, `src/pages/Projects.tsx`, `src/pages/AdminLogin.tsx`, `src/pages/Admin.tsx`, `src/pages/AdminLinks.tsx`, `src/pages/AdminShows.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: Create placeholder page components**

Create `src/pages/Home.tsx`:

```tsx
export default function Home() {
  return (
    <div className="flex flex-col items-center py-12 px-4">
      <h1 className="text-2xl font-bold mb-2">Zachary Roland</h1>
      <p className="text-terminal-green-muted mb-8">software engineer // musician</p>
      <p className="text-sm text-terminal-green-muted">[ links will go here ]</p>
    </div>
  );
}
```

Create `src/pages/About.tsx`:

```tsx
export default function About() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">~/about</h1>
      <p className="text-terminal-green-muted">[ bio content will go here ]</p>
    </div>
  );
}
```

Create `src/pages/Music.tsx`:

```tsx
export default function Music() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">~/music</h1>
      <p className="text-terminal-green-muted">[ music content will go here ]</p>
    </div>
  );
}
```

Create `src/pages/Projects.tsx`:

```tsx
export default function Projects() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">~/projects</h1>
      <p className="text-terminal-green-muted">[ projects will go here ]</p>
    </div>
  );
}
```

Create `src/pages/AdminLogin.tsx`:

```tsx
export default function AdminLogin() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold mb-6">admin login</h1>
        <p className="text-terminal-green-muted">[ login form will go here ]</p>
      </div>
    </div>
  );
}
```

Create `src/pages/Admin.tsx`:

```tsx
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
```

Create `src/pages/AdminLinks.tsx`:

```tsx
export default function AdminLinks() {
  return <p className="text-terminal-green-muted">[ links manager will go here ]</p>;
}
```

Create `src/pages/AdminShows.tsx`:

```tsx
export default function AdminShows() {
  return <p className="text-terminal-green-muted">[ shows manager will go here ]</p>;
}
```

- [ ] **Step 2: Create route definitions with lazy imports**

Create `src/routes.tsx`:

```tsx
import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router";
import App from "./App";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Music = lazy(() => import("./pages/Music"));
const Projects = lazy(() => import("./pages/Projects"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLinks = lazy(() => import("./pages/AdminLinks"));
const AdminShows = lazy(() => import("./pages/AdminShows"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "music", element: <Music /> },
      { path: "projects", element: <Projects /> },
      { path: "admin/login", element: <AdminLogin /> },
      {
        path: "admin",
        element: <Admin />,
        children: [
          { index: true, element: <Navigate to="links" replace /> },
          { path: "links", element: <AdminLinks /> },
          { path: "shows", element: <AdminShows /> },
        ],
      },
    ],
  },
];
```

- [ ] **Step 3: Create root App layout component**

Create `src/App.tsx`:

```tsx
import { Suspense } from "react";
import { Outlet } from "react-router";

export default function App() {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar will be added in Task 4 */}
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <span className="text-terminal-green-muted">loading...</span>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Update main.tsx to use the router**

Replace `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import "./index.css";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
```

- [ ] **Step 5: Verify routing works**

```bash
npm run dev -- --port 3000 &
sleep 3
curl -s http://localhost:3000 | head -20
curl -s http://localhost:3000/about | head -20
kill %1
```

Expected: Both routes return HTML with the Vite entry point. (SPA routing — actual content renders client-side.)

- [ ] **Step 6: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add React Router v7 with route definitions and placeholder pages"
```

---

### Task 4: Sidebar Component (Desktop)

**Files:**
- Create: `src/components/Sidebar.tsx`, `src/components/SocialIcons.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create shared navigation constant**

Create `src/lib/navigation.ts`:

```ts
export const navItems = [
  { to: "/", label: "~/links" },
  { to: "/about", label: "~/about" },
  { to: "/music", label: "~/music" },
  { to: "/projects", label: "~/projects" },
] as const;
```

- [ ] **Step 2: Create SocialIcons component**

Create `src/components/SocialIcons.tsx`:

```tsx
import type { ReactNode } from "react";

// TODO: Replace placeholder URLs with Zachary's real social profiles
const socials = [
  { label: "GitHub", href: "https://github.com/zacharyroland", icon: "github" },
  { label: "Facebook", href: "https://facebook.com/zacharyroland", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com/zacharyroland", icon: "instagram" },
  { label: "Bluesky", href: "https://bsky.app/profile/zacharyroland", icon: "bluesky" },
] as const;

// Simple SVG icons inline — no dependency needed
const icons: Record<string, ReactNode> = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  bluesky: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.6 3.476 6.153 3.228-4.065.39-7.668 2.11-4.337 7.527C5.78 26.903 11.171 21.28 12 17.67c.829 3.61 5.553 8.903 9.56 3.332 3.332-5.418-.272-7.136-4.337-7.527 2.553.248 5.368-.601 6.153-3.228.246-.828.624-5.79.624-6.479 0-.689-.139-1.861-.902-2.203-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z" />
    </svg>
  ),
};

interface SocialIconsProps {
  className?: string;
}

export default function SocialIcons({ className = "" }: SocialIconsProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {socials.map((s) => (
        <a
          key={s.icon}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="text-terminal-green-muted hover:text-terminal-green transition-colors"
        >
          {icons[s.icon]}
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create Sidebar component**

Create `src/components/Sidebar.tsx`:

```tsx
import { NavLink } from "react-router";
import { navItems } from "../lib/navigation";
import SocialIcons from "./SocialIcons";

export default function Sidebar() {
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
        </nav>
      </div>
      <SocialIcons className="mt-auto pt-6" />
    </aside>
  );
}
```

- [ ] **Step 4: Wire Sidebar into App.tsx**

Replace `src/App.tsx`:

```tsx
import { Suspense } from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <span className="text-terminal-green-muted">loading...</span>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
```

- [ ] **Step 5: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add desktop sidebar with terminal-style navigation and social icons"
```

---

### Task 5: Mobile Navigation + Footer

**Files:**
- Create: `src/components/MobileNav.tsx`, `src/components/Footer.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create MobileNav component**

Create `src/components/MobileNav.tsx`:

```tsx
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
```

- [ ] **Step 2: Create Footer component**

Create `src/components/Footer.tsx`:

```tsx
import SocialIcons from "./SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-terminal-green-faint mt-auto px-4 py-6">
      <div className="flex flex-col items-center gap-4">
        {/* Social icons: visible on mobile, hidden on desktop (sidebar has them) */}
        <SocialIcons className="md:hidden" />
        <a
          href="mailto:zachary@example.com"
          className="text-sm text-terminal-green-muted hover:text-terminal-green transition-colors"
        >
          zachary@example.com
        </a>
        <p className="text-xs text-terminal-green-muted">
          &copy; {new Date().getFullYear()} Zachary Roland
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Wire MobileNav and Footer into App.tsx**

Replace `src/App.tsx`:

```tsx
import { Suspense } from "react";
import { Outlet } from "react-router";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <MobileNav />
        <main className="flex-1 overflow-y-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <span className="text-terminal-green-muted">loading...</span>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add mobile hamburger nav and footer with social links"
```

---

## Chunk 2: Firebase Setup + Dynamic Data Hooks

This chunk sets up Firebase (Firestore + Auth), creates the data hooks for links/shows/settings, and wires the Home page to display dynamic link buttons from Firestore.

### Task 6: Firebase Configuration

**Files:**
- Create: `src/lib/firebase.ts`, `.firebaserc`, `firebase.json`, `firestore.rules`, `firestore.indexes.json`
- Modify: `package.json`

- [ ] **Step 1: Install Firebase SDK**

```bash
npm install firebase
```

- [ ] **Step 2: Create Firebase config module**

Create `src/lib/firebase.ts`:

```ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
```

- [ ] **Step 3: Create .env.example (template — not committed with real values)**

Create `.env.example`:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Add `.env` and `.env.local` to `.gitignore`:

Replace `.gitignore` (CRA's default is no longer relevant):

```
node_modules
dist
.env
.env.local
*.local
```

- [ ] **Step 4: Create Firebase hosting config**

Create `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

Create `.firebaserc`:

```json
{
  "projects": {
    "default": "link-in-bio"
  }
}
```

- [ ] **Step 5: Create Firestore security rules**

Create `firestore.rules`:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to links, shows, settings
    // Write access: requires authentication. This project has a single admin user
    // with no public sign-up flow, so any authenticated user is the admin.
    // To restrict further, replace `request.auth != null` with a specific UID check.
    match /links/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /shows/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Create `firestore.indexes.json`:

```json
{
  "indexes": [],
  "fieldOverrides": []
}
```

- [ ] **Step 6: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add .env.example .firebaserc firebase.json firestore.rules firestore.indexes.json .gitignore src/lib/firebase.ts
git commit -m "feat: add Firebase configuration with Firestore and Auth"
```

---

### Task 7: Firestore Data Hooks

**Files:**
- Create: `src/hooks/useLinks.ts`, `src/hooks/useShows.ts`, `src/hooks/useSettings.ts`

- [ ] **Step 1: Create useLinks hook**

Create `src/hooks/useLinks.ts`:

```ts
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Link {
  id: string;
  label: string;
  url: string;
  order: number;
  createdAt: Timestamp;
}

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "links"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Link[];
      setLinks(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { links, loading };
}
```

- [ ] **Step 2: Create useShows hook**

Create `src/hooks/useShows.ts`:

```ts
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Show {
  id: string;
  date: Timestamp;
  venue: string;
  city: string;
  ticketUrl?: string;
  createdAt: Timestamp;
}

export function useShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "shows"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Show[];
      setShows(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const upcomingShows = shows.filter(
    (show) => show.date.toDate() >= new Date()
  );

  return { shows, upcomingShows, loading };
}
```

- [ ] **Step 3: Create useSettings hook**

Create `src/hooks/useSettings.ts`:

```ts
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface HomeSettings {
  youtubeUrl: string;
  youtubeEnabled: boolean;
}

const defaultSettings: HomeSettings = {
  youtubeUrl: "",
  youtubeEnabled: false,
};

export function useSettings() {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "home"), (snapshot) => {
      if (snapshot.exists()) {
        setSettings(snapshot.data() as HomeSettings);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { settings, loading };
}
```

- [ ] **Step 4: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/
git commit -m "feat: add Firestore hooks for links, shows, and settings"
```

---

### Task 8: LinkButton + YouTubeEmbed Components

**Files:**
- Create: `src/components/LinkButton.tsx`, `src/components/YouTubeEmbed.tsx`

- [ ] **Step 1: Create LinkButton component**

Create `src/components/LinkButton.tsx`:

```tsx
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
```

- [ ] **Step 2: Create YouTubeEmbed component**

Create `src/components/YouTubeEmbed.tsx`:

```tsx
interface YouTubeEmbedProps {
  url: string;
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function YouTubeEmbed({ url }: YouTubeEmbedProps) {
  const videoId = extractVideoId(url);
  if (!videoId) return null;

  return (
    <div className="w-full max-w-md aspect-video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded border border-terminal-green-faint"
      />
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/LinkButton.tsx src/components/YouTubeEmbed.tsx
git commit -m "feat: add LinkButton and YouTubeEmbed components"
```

---

### Task 9: Wire Home Page to Firestore Data

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Update Home page with dynamic links**

Replace `src/pages/Home.tsx`:

```tsx
import { useLinks } from "../hooks/useLinks";
import { useSettings } from "../hooks/useSettings";
import LinkButton from "../components/LinkButton";
import YouTubeEmbed from "../components/YouTubeEmbed";

export default function Home() {
  const { links, loading: linksLoading } = useLinks();
  const { settings, loading: settingsLoading } = useSettings();

  if (linksLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-terminal-green-muted">loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-12 px-4 gap-4">
      <img
        src="/profile.jpg"
        alt="Zachary Roland"
        className="w-28 h-28 rounded-full border-2 border-terminal-green-faint mb-4"
      />
      <h1 className="text-2xl font-bold">Zachary Roland</h1>
      <p className="text-terminal-green-muted mb-4">
        software engineer // musician
      </p>

      {links.map((link) => (
        <LinkButton key={link.id} label={link.label} url={link.url} />
      ))}

      {links.length === 0 && (
        <p className="text-sm text-terminal-green-muted">No links yet.</p>
      )}

      {settings.youtubeEnabled && settings.youtubeUrl && (
        <div className="mt-6">
          <YouTubeEmbed url={settings.youtubeUrl} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: wire Home page to Firestore links and YouTube settings"
```

---

## Chunk 3: Static Content Pages

This chunk fills in the About, Music, and Projects pages with their full content (hardcoded sections + dynamic data for shows).

### Task 10: About Page

**Files:**
- Modify: `src/pages/About.tsx`

- [ ] **Step 1: Write About page content**

Replace `src/pages/About.tsx`:

```tsx
export default function About() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">~/about</h1>

      <div className="space-y-4 text-terminal-green-muted leading-relaxed">
        <p>
          Hey, I'm Zachary — a software engineer by trade and a musician by
          passion. I spend my days building things for the web and my nights
          making noise with various bands.
        </p>
        <p>
          {/* TODO: Zachary to fill in real bio content */}
          More details coming soon. In the meantime, check out my links or
          browse my projects.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/About.tsx
git commit -m "feat: add About page with placeholder bio content"
```

---

### Task 11: ShowCard Component + Music Page

**Files:**
- Create: `src/components/ShowCard.tsx`
- Modify: `src/pages/Music.tsx`

- [ ] **Step 1: Create ShowCard component**

Create `src/components/ShowCard.tsx`:

```tsx
import type { Show } from "../hooks/useShows";

interface ShowCardProps {
  show: Show;
}

export default function ShowCard({ show }: ShowCardProps) {
  const date = show.date.toDate();
  const formatted = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="border border-terminal-green-faint rounded px-4 py-3 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-bold text-terminal-green">{formatted}</p>
        <p className="text-sm text-terminal-green-muted">
          {show.venue} — {show.city}
        </p>
      </div>
      {show.ticketUrl && (
        <a
          href={show.ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs border border-terminal-green px-3 py-1 rounded text-terminal-green hover:bg-terminal-green-dim transition-colors whitespace-nowrap"
        >
          tickets
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Write Music page with static bands + dynamic shows**

Replace `src/pages/Music.tsx`:

```tsx
import { useShows } from "../hooks/useShows";
import ShowCard from "../components/ShowCard";

const bands = [
  {
    name: "Band Name Here",
    role: "Guitar / Vocals",
    description:
      "A brief description of the band and what kind of music they play.",
    streamingLink: "https://example.com/band-link",
  },
  // TODO: Zachary to add real band profiles
];

export default function Music() {
  const { upcomingShows, loading } = useShows();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8">~/music</h1>

      {/* Band Profiles */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4 text-terminal-green-muted">
          bands
        </h2>
        <div className="space-y-6">
          {bands.map((band) => (
            <div
              key={band.name}
              className="border border-terminal-green-faint rounded p-4"
            >
              <h3 className="font-bold text-terminal-green">{band.name}</h3>
              <p className="text-sm text-terminal-green-muted mt-1">
                {band.role}
              </p>
              <p className="text-sm text-terminal-green-muted mt-2">
                {band.description}
              </p>
              <a
                href={band.streamingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs border border-terminal-green px-3 py-1 rounded text-terminal-green hover:bg-terminal-green-dim transition-colors"
              >
                listen
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Shows */}
      <section>
        <h2 className="text-lg font-bold mb-4 text-terminal-green-muted">
          upcoming shows
        </h2>
        {loading ? (
          <p className="text-sm text-terminal-green-muted">loading...</p>
        ) : upcomingShows.length === 0 ? (
          <p className="text-sm text-terminal-green-muted">
            No upcoming shows.
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ShowCard.tsx src/pages/Music.tsx
git commit -m "feat: add Music page with band profiles and dynamic upcoming shows"
```

---

### Task 12: ProjectCard Component + Projects Page

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Modify: `src/pages/Projects.tsx`

- [ ] **Step 1: Create ProjectCard component**

Create `src/components/ProjectCard.tsx`:

```tsx
interface ProjectCardProps {
  name: string;
  description: string;
  tech: string[];
  url: string;
}

export default function ProjectCard({
  name,
  description,
  tech,
  url,
}: ProjectCardProps) {
  return (
    <div className="border border-terminal-green-faint rounded p-4">
      <h3 className="font-bold text-terminal-green">{name}</h3>
      <p className="text-sm text-terminal-green-muted mt-1">{description}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {tech.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 border border-terminal-green-faint rounded text-terminal-green-muted"
          >
            {t}
          </span>
        ))}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-xs border border-terminal-green px-3 py-1 rounded text-terminal-green hover:bg-terminal-green-dim transition-colors"
      >
        view project
      </a>
    </div>
  );
}
```

- [ ] **Step 2: Write Projects page**

Replace `src/pages/Projects.tsx`:

```tsx
import ProjectCard from "../components/ProjectCard";

const projects = [
  {
    name: "Project Name Here",
    description: "A brief description of the project and what it does.",
    tech: ["React", "TypeScript", "Firebase"],
    url: "https://example.com",
  },
  // TODO: Zachary to add real projects
];

export default function Projects() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-8">~/projects</h1>
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectCard.tsx src/pages/Projects.tsx
git commit -m "feat: add Projects page with project cards"
```

---

## Chunk 4: Auth + Admin Dashboard

This chunk adds Firebase Auth, the protected route guard, login page, and the admin dashboard with links manager (drag-to-reorder) and shows manager (CRUD).

### Task 13: Auth Context + useAuth Hook + ProtectedRoute

**Files:**
- Create: `src/context/AuthContext.tsx`, `src/hooks/useAuth.ts`, `src/components/ProtectedRoute.tsx`
- Modify: `src/routes.tsx`, `src/main.tsx`

- [ ] **Step 1: Create useAuth hook**

Create `src/hooks/useAuth.ts`:

```ts
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = () => signOut(auth);

  return { user, loading, login, logout };
}
```

- [ ] **Step 2: Create AuthContext**

Create `src/context/AuthContext.tsx`:

```tsx
import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
```

- [ ] **Step 3: Create ProtectedRoute component**

Create `src/components/ProtectedRoute.tsx`:

```tsx
import { Navigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="text-terminal-green-muted">authenticating...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
```

- [ ] **Step 4: Wrap app with AuthProvider and protect admin routes**

Update `src/routes.tsx`:

```tsx
import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Music = lazy(() => import("./pages/Music"));
const Projects = lazy(() => import("./pages/Projects"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLinks = lazy(() => import("./pages/AdminLinks"));
const AdminShows = lazy(() => import("./pages/AdminShows"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "music", element: <Music /> },
      { path: "projects", element: <Projects /> },
      { path: "admin/login", element: <AdminLogin /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="links" replace /> },
          { path: "links", element: <AdminLinks /> },
          { path: "shows", element: <AdminShows /> },
        ],
      },
    ],
  },
];
```

Update `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { routes } from "./routes";
import "./index.css";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
```

- [ ] **Step 5: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useAuth.ts src/context/AuthContext.tsx src/components/ProtectedRoute.tsx src/routes.tsx src/main.tsx
git commit -m "feat: add Firebase Auth context, useAuth hook, and protected route guard"
```

---

### Task 14: Admin Login Page

**Files:**
- Modify: `src/pages/AdminLogin.tsx`

- [ ] **Step 1: Implement login form**

Replace `src/pages/AdminLogin.tsx`:

```tsx
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";

export default function AdminLogin() {
  const { login, user } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">admin login</h1>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm text-terminal-green-muted mb-1">
            email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border border-terminal-green-faint rounded px-3 py-2 text-terminal-green focus:outline-none focus:border-terminal-green"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-terminal-green-muted mb-1">
            password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-transparent border border-terminal-green-faint rounded px-3 py-2 text-terminal-green focus:outline-none focus:border-terminal-green"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-terminal-green text-terminal-green py-2 rounded hover:bg-terminal-green-dim transition-colors disabled:opacity-50"
        >
          {submitting ? "logging in..." : "login"}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/AdminLogin.tsx
git commit -m "feat: add admin login page with email/password form"
```

---

### Task 15: Admin Links Manager (CRUD + Drag-to-Reorder + YouTube Toggle)

**Files:**
- Modify: `src/pages/AdminLinks.tsx`
- Modify: `package.json`

- [ ] **Step 1: Install drag-and-drop library**

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

- [ ] **Step 2: Implement AdminLinks page**

Replace `src/pages/AdminLinks.tsx`:

```tsx
import { useState, useEffect, type FormEvent } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { db } from "../lib/firebase";
import { useLinks, type Link } from "../hooks/useLinks";
import { useSettings } from "../hooks/useSettings";

function SortableLink({
  link,
  onEdit,
  onDelete,
}: {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border border-terminal-green-faint rounded px-3 py-2"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-terminal-green-muted hover:text-terminal-green"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-terminal-green truncate">
          {link.label}
        </p>
        <p className="text-xs text-terminal-green-muted truncate">{link.url}</p>
      </div>
      <button
        onClick={() => onEdit(link)}
        className="text-xs text-terminal-green-muted hover:text-terminal-green"
      >
        edit
      </button>
      <button
        onClick={() => onDelete(link.id)}
        className="text-xs text-red-400 hover:text-red-300"
      >
        delete
      </button>
    </div>
  );
}

export default function AdminLinks() {
  const { links } = useLinks();
  const { settings } = useSettings();
  const [editing, setEditing] = useState<Link | null>(null);
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeEnabled, setYoutubeEnabled] = useState(false);

  // Sync local state when Firestore settings load
  useEffect(() => {
    setYoutubeUrl(settings.youtubeUrl);
    setYoutubeEnabled(settings.youtubeEnabled);
  }, [settings.youtubeUrl, settings.youtubeEnabled]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function startEdit(link: Link) {
    setEditing(link);
    setLabel(link.label);
    setUrl(link.url);
  }

  function resetForm() {
    setEditing(null);
    setLabel("");
    setUrl("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (editing) {
      await updateDoc(doc(db, "links", editing.id), { label, url });
    } else {
      await addDoc(collection(db, "links"), {
        label,
        url,
        order: links.length,
        createdAt: serverTimestamp(),
      });
    }
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this link?")) return;
    await deleteDoc(doc(db, "links", id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((l) => l.id === active.id);
    const newIndex = links.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(links, oldIndex, newIndex);

    const batch = writeBatch(db);
    reordered.forEach((link, index) => {
      batch.update(doc(db, "links", link.id), { order: index });
    });
    await batch.commit();
  }

  async function handleYoutubeSettingsSave() {
    await setDoc(doc(db, "settings", "home"), {
      youtubeUrl,
      youtubeEnabled,
    });
  }

  return (
    <div className="space-y-8">
      {/* Link Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <h2 className="text-sm font-bold text-terminal-green-muted">
          {editing ? "edit link" : "add link"}
        </h2>
        <input
          type="text"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
          className="w-full bg-transparent border border-terminal-green-faint rounded px-3 py-2 text-sm text-terminal-green focus:outline-none focus:border-terminal-green"
        />
        <input
          type="url"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full bg-transparent border border-terminal-green-faint rounded px-3 py-2 text-sm text-terminal-green focus:outline-none focus:border-terminal-green"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="border border-terminal-green text-terminal-green px-4 py-1.5 rounded text-sm hover:bg-terminal-green-dim transition-colors"
          >
            {editing ? "save" : "add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-terminal-green-faint text-terminal-green-muted px-4 py-1.5 rounded text-sm hover:text-terminal-green transition-colors"
            >
              cancel
            </button>
          )}
        </div>
      </form>

      {/* Links List */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-terminal-green-muted">
          links ({links.length})
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            {links.map((link) => (
              <SortableLink
                key={link.id}
                link={link}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* YouTube Settings */}
      <div className="space-y-3 border-t border-terminal-green-faint pt-6">
        <h2 className="text-sm font-bold text-terminal-green-muted">
          youtube embed
        </h2>
        <label className="flex items-center gap-2 text-sm text-terminal-green-muted cursor-pointer">
          <input
            type="checkbox"
            checked={youtubeEnabled}
            onChange={(e) => setYoutubeEnabled(e.target.checked)}
            className="accent-terminal-green"
          />
          show youtube embed on home page
        </label>
        <input
          type="url"
          placeholder="YouTube URL"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="w-full bg-transparent border border-terminal-green-faint rounded px-3 py-2 text-sm text-terminal-green focus:outline-none focus:border-terminal-green"
        />
        <button
          onClick={handleYoutubeSettingsSave}
          className="border border-terminal-green text-terminal-green px-4 py-1.5 rounded text-sm hover:bg-terminal-green-dim transition-colors"
        >
          save youtube settings
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/pages/AdminLinks.tsx
git commit -m "feat: add admin links manager with CRUD, drag-to-reorder, and YouTube toggle"
```

---

### Task 16: Admin Shows Manager (CRUD)

**Files:**
- Modify: `src/pages/AdminShows.tsx`

- [ ] **Step 1: Implement AdminShows page**

Replace `src/pages/AdminShows.tsx`:

```tsx
import { useState, type FormEvent } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useShows, type Show } from "../hooks/useShows";

export default function AdminShows() {
  const { shows } = useShows();
  const [editing, setEditing] = useState<Show | null>(null);
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");

  function startEdit(show: Show) {
    setEditing(show);
    setDate(show.date.toDate().toISOString().split("T")[0]);
    setVenue(show.venue);
    setCity(show.city);
    setTicketUrl(show.ticketUrl ?? "");
  }

  function resetForm() {
    setEditing(null);
    setDate("");
    setVenue("");
    setCity("");
    setTicketUrl("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const data = {
      date: Timestamp.fromDate(new Date(date + "T00:00:00")),
      venue,
      city,
      ticketUrl: ticketUrl || null,
    };

    if (editing) {
      await updateDoc(doc(db, "shows", editing.id), data);
    } else {
      await addDoc(collection(db, "shows"), {
        ...data,
        createdAt: serverTimestamp(),
      });
    }
    resetForm();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this show?")) return;
    await deleteDoc(doc(db, "shows", id));
  }

  const now = new Date();

  return (
    <div className="space-y-8">
      {/* Show Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <h2 className="text-sm font-bold text-terminal-green-muted">
          {editing ? "edit show" : "add show"}
        </h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full bg-transparent border border-terminal-green-faint rounded px-3 py-2 text-sm text-terminal-green focus:outline-none focus:border-terminal-green"
        />
        <input
          type="text"
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          required
          className="w-full bg-transparent border border-terminal-green-faint rounded px-3 py-2 text-sm text-terminal-green focus:outline-none focus:border-terminal-green"
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full bg-transparent border border-terminal-green-faint rounded px-3 py-2 text-sm text-terminal-green focus:outline-none focus:border-terminal-green"
        />
        <input
          type="url"
          placeholder="Ticket URL (optional)"
          value={ticketUrl}
          onChange={(e) => setTicketUrl(e.target.value)}
          className="w-full bg-transparent border border-terminal-green-faint rounded px-3 py-2 text-sm text-terminal-green focus:outline-none focus:border-terminal-green"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="border border-terminal-green text-terminal-green px-4 py-1.5 rounded text-sm hover:bg-terminal-green-dim transition-colors"
          >
            {editing ? "save" : "add"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="border border-terminal-green-faint text-terminal-green-muted px-4 py-1.5 rounded text-sm hover:text-terminal-green transition-colors"
            >
              cancel
            </button>
          )}
        </div>
      </form>

      {/* Shows List */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-terminal-green-muted">
          all shows ({shows.length})
        </h2>
        {shows.map((show) => {
          const isPast = show.date.toDate() < now;
          const formatted = show.date.toDate().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={show.id}
              className={`flex items-center gap-3 border rounded px-3 py-2 ${
                isPast
                  ? "border-terminal-green-dim opacity-50"
                  : "border-terminal-green-faint"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-terminal-green truncate">
                  {formatted}
                  {isPast && (
                    <span className="ml-2 text-xs text-terminal-green-muted font-normal">
                      (past)
                    </span>
                  )}
                </p>
                <p className="text-xs text-terminal-green-muted truncate">
                  {show.venue} — {show.city}
                </p>
              </div>
              <button
                onClick={() => startEdit(show)}
                className="text-xs text-terminal-green-muted hover:text-terminal-green"
              >
                edit
              </button>
              <button
                onClick={() => handleDelete(show.id)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add logout button to Admin layout**

Update `src/pages/Admin.tsx`:

```tsx
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
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/AdminShows.tsx src/pages/Admin.tsx
git commit -m "feat: add admin shows manager with CRUD and logout button"
```

---

## Chunk 5: Polish + Accessibility + Build Verification

This final chunk adds focus styles, aria attributes, verifies the production build, and confirms the complete app is functional.

### Task 17: Accessibility Polish

**Files:**
- Modify: `src/index.css`, `src/components/Sidebar.tsx`, `src/components/MobileNav.tsx`, `src/App.tsx`

- [ ] **Step 1: Add focus-visible styles and accessibility utilities**

Add to `src/index.css` inside the `@layer base` block:

```css
  /* Visible focus states for keyboard navigation */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-terminal-green;
  }

  /* Remove default focus ring when using mouse */
  :focus:not(:focus-visible) {
    outline: none;
  }
```

- [ ] **Step 2: Verify semantic HTML landmarks**

Audit and ensure:
- `src/App.tsx`: The `<main>` element wraps the content area (already uses `<main>` tag)
- `src/components/Sidebar.tsx`: The sidebar uses `<aside>` (already correct) and its nav links are inside a `<nav>` element (already correct)
- `src/components/MobileNav.tsx`: The `<header>` and `<nav>` elements are used (already correct)
- `src/components/Footer.tsx`: Uses `<footer>` element (already correct)
- `src/components/SocialIcons.tsx`: Each icon link has `aria-label={s.label}` (already correct)

All landmark elements are already in place from earlier tasks. Verify no regressions.

- [ ] **Step 3: Verify base font size is 16px+**

The Tailwind default `text-base` is 16px (1rem). Body text throughout uses default or larger sizes. Verify by inspecting `src/index.css` — no font-size overrides below 16px for body text. Small labels (`text-xs`, `text-sm`) are only for secondary UI elements, not primary reading content.

- [ ] **Step 4: Verify TypeScript compilation**

```bash
npx tsc -b
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add keyboard focus styles for accessibility"
```

---

### Task 18: Production Build Verification

**Files:** (no new files)

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds. Output in `dist/` directory with code-split chunks per route.

- [ ] **Step 2: Preview production build**

```bash
npm run preview -- --port 4173 &
sleep 2
curl -s http://localhost:4173 | head -30
kill %1
```

Expected: HTML loads with the production bundle.

- [ ] **Step 3: Verify dist output includes route chunks**

```bash
ls -la dist/assets/
```

Expected: Multiple `.js` chunks (lazy-loaded routes) and CSS file(s).

- [ ] **Step 4: Add dist to .gitignore if not already present**

Ensure `dist` is in `.gitignore` (it was added in Task 6).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: verify production build and finalize project setup"
```

---

## Post-Implementation Checklist

After all tasks are complete, verify:

1. `npm run dev` starts without errors
2. All 5 public routes render (`/`, `/about`, `/music`, `/projects`, `/admin/login`)
3. Admin routes redirect to login when not authenticated
4. Sidebar is visible on desktop (>= 768px), hidden on mobile
5. Mobile nav hamburger works
6. Terminal theme (dark navy bg, green text, scanlines) is applied
7. `npm run build` succeeds
8. All social links in sidebar and footer point to correct URLs (update placeholder URLs with real ones)
9. `.env` file exists with real Firebase project credentials (not committed)
