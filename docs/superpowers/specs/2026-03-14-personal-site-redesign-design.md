# Personal Site Redesign — Design Spec

## Overview

A personal website for Zachary Roland — software engineer and musician — built around a link-in-bio concept. On mobile, the home page is a clean link-in-bio hub. On desktop, a terminal-styled sidebar expands the site into a full multi-section personal site.

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7 (client-side SPA)
- **Backend/Hosting:** Firebase (Hosting, Firestore, Auth)

## Visual Design

### Aesthetic
Retro terminal theme — softer green (#4af686) on dark navy (#1a1a2e). Terminal-inspired without heavy animation.

### Terminal Touches
- Faint CSS scanline overlay on background (decorative only)
- Blinking cursor on active nav item
- Monospace font for nav/headers (JetBrains Mono or similar)
- Readable sans-serif or legible monospace for body text (16px+ base)
- Link buttons have subtle glow on hover

### Color Palette
- Background: #1a1a2e
- Primary text/accent: #4af686
- Secondary text: muted green or light gray
- Borders: green at varying opacities

## Layout & Responsive Behavior

### Mobile (< 768px)
- No sidebar — full-screen content
- Home page: name/tagline at top, vertical stack of link buttons, optional YouTube embed
- Navigation via hamburger menu
- Other pages scroll vertically, nav accessible from any page

### Desktop (>= 768px)
- Left sidebar (~250px) styled as terminal file tree, always visible
- Sidebar structure:
  ```
  zachary-roland
  ├── ~/links        (home)
  ├── ~/about
  ├── ~/music
  └── ~/projects

  [github] [facebook] [instagram] [bluesky]
  ```
- Main content area fills remaining width, centered with max-width for readability
- Social links (GitHub, Facebook, Instagram, Bluesky) displayed as icons at bottom of sidebar

## Project Structure

```
src/
  components/       # Shared UI (LinkButton, Nav, Sidebar, Footer, etc.)
  pages/            # Route-level components (Home, About, Music, Projects, Admin)
  hooks/            # Custom hooks (useFirestore, useAuth, useLinks, useShows)
  context/          # AuthContext for admin state
  lib/              # Firebase config, helpers
  assets/           # Fonts, images
  styles/           # Tailwind config, global CSS (scanline overlay, etc.)
```

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Link-in-bio hub (dynamic content from Firestore) |
| `/about` | About | Bio, background info (hardcoded) |
| `/music` | Music | Band profiles (hardcoded) + upcoming shows (dynamic) |
| `/projects` | Projects | Curated project showcase (hardcoded) |
| `/admin` | Admin | Protected dashboard for managing links and shows |

## Page Content

### Home (Link-in-Bio Hub)
- Name + short tagline ("software engineer // musician")
- Optional profile photo/avatar (hardcoded asset in src/assets)
- Dynamic link buttons from Firestore — each has label text + URL, admin-ordered
- Optional YouTube embed (admin toggleable)

### About
- A few paragraphs — developer by trade, musician by passion
- Hardcoded content (edited in React source)
- Optional photos (hardcoded assets in src/assets)

### Music
- **Band profiles (hardcoded):** One section per band with:
  - Band name, description, role
  - Single smart link to streaming aggregator (Linkfire, Songwhip, etc.)
- **Upcoming shows (dynamic from Firestore):**
  - Each show: date, venue, city, optional ticket/event link
  - Section hides or shows "No upcoming shows" when empty

### Projects
- Curated list of projects (hardcoded)
- Each project: name, description, tech used, link to live site or repo
- Simple card layout

### Footer
- Contact email
- Social links (GitHub, Facebook, Instagram, Bluesky) — visible on mobile (duplicates sidebar on desktop)
- Copyright/year

## Admin Dashboard

### Access
- `/admin` route protected by Firebase Auth
- Single admin user (email/password login)
- Redirects to dashboard on success

### Design
- Clean utility UI — dark background with green accents
- Cohesive with main site palette but not full terminal theme
- Prioritizes usability

### Links Manager
- List of current links with up/down arrows to reorder
- Each link: label text + URL + edit/delete
- "Add Link" button
- YouTube embed toggle: on/off + URL field

### Shows Manager
- List of upcoming shows sorted by date
- Each show: date, venue, city, optional ticket/event link + edit/delete
- "Add Show" button
- Past shows are filtered out of the public Music page but remain visible in the admin dashboard for reference

## Firestore Data Model

```
links/
  {id}: { label: string, url: string, order: number, createdAt: timestamp }

shows/
  {id}: { date: timestamp, venue: string, city: string, ticketUrl?: string, createdAt: timestamp }

settings/
  home: { youtubeUrl: string, youtubeEnabled: boolean }
```

### Security Rules
- Public: read access to `links`, `shows`, `settings`
- Authenticated admin only: write access to all collections

## Accessibility (WCAG AA)

- Green (#4af686) on dark navy (#1a1a2e) passes 4.5:1 contrast ratio (~12:1)
- 16px+ base font size for readability
- All interactive elements keyboard-navigable with visible green focus states
- Semantic HTML: proper headings, nav landmarks, link roles
- Scanline overlay is purely decorative (CSS pseudo-element, invisible to screen readers)
- Alt text on all images
- aria-labels on icon-only social links

## Performance

- Vite code-splitting by route (lazy-loaded chunks)
- Firebase SDK tree-shaken (import only what's used)
- Tailwind purges unused CSS at build
- Images optimized (WebP where possible)
- Firestore reads are small and cacheable
