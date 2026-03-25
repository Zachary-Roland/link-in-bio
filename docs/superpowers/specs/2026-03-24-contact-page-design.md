# Contact Page Design Spec
**Date:** 2026-03-24
**Status:** Approved

## Overview

Add a `/contact` page to zacharyroland.dev that serves as a freelance pitch and contact form for Zachary's web design services. The page is cohesive with the site's existing terminal/CRT aesthetic and uses EmailJS to send form submissions directly to Zachary's inbox with no backend infrastructure.

---

## Routing & Navigation

- New lazy-loaded page: `src/pages/Contact.tsx`
- Route added to `routes.tsx`: `{ path: "contact", element: <Contact /> }`
- Nav item added to `src/lib/navigation.ts`: `{ to: "/contact", label: "~/contact" }` — positioned after `~/projects`

---

## Page Layout

Two vertically stacked bordered cards (`border border-terminal-green-faint`), max-width `max-w-2xl mx-auto`, consistent with `About` and `Projects` pages. Page heading: `~/contact`.

---

## Panel 1: Freelance Pitch

A terminal-style status card conveying availability and value proposition.

**Contents:**
- Prompt line: `~/freelance $ status --available` — `text-terminal-green-muted`
- Status line: `> accepting new clients` — `text-terminal-green`
- Tagline: `"I'll build your website."` — bold, prominent
- Stats grid (2×2 on mobile, 4-column on desktop):
  - `4+` / Years as a professional software engineer
  - `50+` / Branded pages shipped at production scale
  - `100%` / Custom code — no templates
  - `∞` / Attention to detail
- Tech stack pills: `React` `TypeScript` `Firebase` `Tailwind` `Node.js` — small bordered tags using `border-terminal-green-faint`, consistent with `ProjectCard` tech tags

---

## Panel 2: Contact Form

A terminal-style form card.

**Header:** `~/contact $ new-message` — prompt style label

**Fields:** name, email, message — each with a muted label above and an underline-style input (`border-b border-terminal-green-faint bg-transparent text-terminal-green`). No full box border for a clean, minimal feel.

**Submit button:** `border border-terminal-green px-4 py-1 hover:bg-terminal-green hover:text-terminal-bg transition-colors` — matches existing site button style.

**Form states:**

| State | Behavior |
|---|---|
| Idle | Normal form display |
| Submitting | Button text → `sending...` with `.loading-dots` animation (reuses existing CSS) |
| Success | Form replaced with `> message sent` confirmation line in `text-terminal-green` |
| Error | Inline error: `> failed to send — try zaroland95@gmail.com` so user always has fallback |

---

## EmailJS Integration

- Package: `@emailjs/browser`
- Call: `emailjs.sendForm(serviceId, templateId, formRef, publicKey)` on submit
- Credentials stored in environment variables:
  - `VITE_EMAILJS_SERVICE_ID`
  - `VITE_EMAILJS_TEMPLATE_ID`
  - `VITE_EMAILJS_PUBLIC_KEY`
- `.env` is gitignored; user must configure EmailJS dashboard (service + template) and populate `.env` before deploying

---

## Files Changed

| File | Change |
|---|---|
| `src/pages/Contact.tsx` | New file |
| `src/routes.tsx` | Add `contact` route + lazy import |
| `src/lib/navigation.ts` | Add `~/contact` nav item |
| `package.json` | Add `@emailjs/browser` dependency |
| `.env` | Add `VITE_EMAILJS_*` vars (not committed) |

---

## Out of Scope

- Admin management of contact submissions
- Spam protection / CAPTCHA
- Notification beyond email (e.g. Slack, SMS)
- Project type dropdown or budget selector on the form
