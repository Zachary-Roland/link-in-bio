# Contact Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/contact` page with a freelance pitch panel and EmailJS-powered contact form, cohesive with the site's terminal/CRT aesthetic.

**Architecture:** Single new page component (`Contact.tsx`) composed of two bordered cards — a pitch panel (terminal-style stats + tech stack) and a contact form panel (name/email/message fields, EmailJS on submit). Navigation and routing updated to include the new page.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, `@emailjs/browser`, Vite env vars (`VITE_*`)

---

## Chunk 1: Setup — EmailJS package, env vars, routing, navigation

### Task 1: Install @emailjs/browser

**Files:**
- Modify: `package.json` (dependency added by npm)

- [ ] **Step 1: Install the package**

```bash
npm install @emailjs/browser
```

Expected output: package added to `dependencies` in `package.json`, `node_modules/@emailjs` present.

- [ ] **Step 2: Verify TypeScript types are available**

```bash
npx tsc --noEmit
```

Expected: no errors (types are bundled with `@emailjs/browser`).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install @emailjs/browser"
```

---

### Task 2: Document EmailJS env vars in .env.example

**Files:**
- Modify: `.env.example`

The `.env.example` file documents required environment variables. Three new keys for EmailJS must be added alongside the existing Firebase keys.

- [ ] **Step 1: Open `.env.example`**

Current contents:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

- [ ] **Step 2: Append the EmailJS keys**

Add these three lines to the end of `.env.example`:
```
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

- [ ] **Step 3: Add the same keys to your local `.env` file with real values**

You must set up EmailJS first:
1. Create an account at https://emailjs.com
2. Add a service (connect your Gmail or other email provider) → copy the **Service ID**
3. Create an email template. The template must reference these variables:
   - `{{from_name}}` — the sender's name
   - `{{reply_to}}` — the sender's email address
   - `{{message}}` — the message body
4. Copy the **Template ID** and your account's **Public Key** (found in Account → API Keys)

Then populate your local `.env`:
```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxx
```

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "feat: document VITE_EMAILJS_* env vars in .env.example"
```

---

### Task 3: Add ~/contact nav item

**Files:**
- Modify: `src/lib/navigation.ts`

The `navItems` array drives both the `Sidebar` (desktop) and `MobileNav` (mobile) components. Adding an item here automatically adds it to both navigation surfaces.

- [ ] **Step 1: Open `src/lib/navigation.ts`**

Current contents:
```ts
export const navItems = [
  { to: "/", label: "~/links" },
  { to: "/about", label: "~/about" },
  { to: "/music", label: "~/music" },
  { to: "/projects", label: "~/projects" },
] as const;
```

- [ ] **Step 2: Add the contact nav item after ~/projects**

```ts
export const navItems = [
  { to: "/", label: "~/links" },
  { to: "/about", label: "~/about" },
  { to: "/music", label: "~/music" },
  { to: "/projects", label: "~/projects" },
  { to: "/contact", label: "~/contact" },
] as const;
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/navigation.ts
git commit -m "feat: add ~/contact nav item"
```

---

### Task 4: Register the /contact route

**Files:**
- Modify: `src/routes.tsx`

React Router v7 lazy-loads each page by declaring it with `lazy()` at the top of the file. The route is then added as a child of the root `App` route. The `Suspense` fallback is already handled in `App.tsx`, so no changes needed there.

- [ ] **Step 1: Open `src/routes.tsx` and add the lazy import**

After line 48 (`const AdminShows = lazy(...)`), add:
```ts
const Contact = lazy(() => import("./pages/Contact"));
```

- [ ] **Step 2: Add the route to the children array**

After `{ path: "projects", element: <Projects /> }` (line 59), add:
```ts
{ path: "contact", element: <Contact /> },
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: error about missing module `./pages/Contact` — this is expected, we haven't created the page yet. It will resolve in the next task.

- [ ] **Step 4: Commit**

```bash
git add src/routes.tsx
git commit -m "feat: register /contact route"
```

---

## Chunk 2: Contact.tsx — pitch panel and form panel

### Task 5: Create Contact.tsx — page shell and pitch panel

**Files:**
- Create: `src/pages/Contact.tsx`

This task creates the full file with the page shell and the pitch panel (Panel 1). The form panel is added in Task 6. Writing in two steps keeps each task focused and verifiable independently.

- [ ] **Step 1: Create `src/pages/Contact.tsx` with the pitch panel**

```tsx
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const stats = [
  { value: "4+", label: "Years as a professional software engineer" },
  { value: "50+", label: "Branded pages shipped at production scale" },
  { value: "100%", label: "Custom code — no templates" },
  { value: "∞", label: "Attention to detail" },
];

const techStack = ["React", "TypeScript", "Firebase", "Tailwind", "Node.js"];

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus("sending");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-2xl font-bold">~/contact</h1>

      {/* Pitch panel */}
      <div className="border border-terminal-green-faint rounded p-6 space-y-4">
        <p className="text-terminal-green-muted text-sm font-mono">
          ~/freelance $ status --available
        </p>
        <p className="text-terminal-green text-sm font-mono">
          &gt; accepting new clients
        </p>
        <p className="text-xl font-bold">I&apos;ll build your website.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {stats.map((stat) => (
            <div key={stat.value} className="space-y-1">
              <p className="text-2xl font-bold text-terminal-green">{stat.value}</p>
              <p className="text-xs text-terminal-green-muted leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 border border-terminal-green-faint rounded text-terminal-green-muted"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Form panel — added in Task 6 */}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. The `./pages/Contact` module is now found, resolving the error from Task 4.

- [ ] **Step 3: Start the dev server and visually verify the pitch panel**

```bash
npm run dev
```

Navigate to `http://localhost:5173/contact`. Verify:
- `~/contact` appears as active nav item in the sidebar with the blinking cursor
- The pitch panel card renders with the terminal prompt, status line, tagline, 2×2 stats grid (4-column on wider screens), and tech stack pills
- Cards have rounded corners matching `ProjectCard` style

- [ ] **Step 4: Commit**

```bash
git add src/pages/Contact.tsx
git commit -m "feat: add contact page pitch panel"
```

---

### Task 6: Add the contact form panel to Contact.tsx

**Files:**
- Modify: `src/pages/Contact.tsx`

Replace the `{/* Form panel — added in Task 6 */}` comment with the full form panel JSX. The `handleSubmit`, `formRef`, and `status` state are already wired up from Task 5.

- [ ] **Step 1: Replace the comment with the form panel**

Replace this line in `Contact.tsx`:
```tsx
      {/* Form panel — added in Task 6 */}
```

With:
```tsx
      {/* Form panel */}
      <div className="border border-terminal-green-faint rounded p-6 space-y-6">
        <p className="text-terminal-green-muted text-sm font-mono">
          ~/contact $ new-message
        </p>

        {status === "sent" ? (
          <p className="text-terminal-green font-mono">&gt; message sent</p>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label htmlFor="from_name" className="block text-xs text-terminal-green-muted">
                name
              </label>
              <input
                id="from_name"
                name="from_name"
                type="text"
                required
                className="w-full bg-transparent border-b border-terminal-green-faint text-terminal-green text-sm py-1 outline-none focus:border-terminal-green transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="reply_to" className="block text-xs text-terminal-green-muted">
                email
              </label>
              <input
                id="reply_to"
                name="reply_to"
                type="email"
                required
                className="w-full bg-transparent border-b border-terminal-green-faint text-terminal-green text-sm py-1 outline-none focus:border-terminal-green transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="block text-xs text-terminal-green-muted">
                message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full bg-transparent border-b border-terminal-green-faint text-terminal-green text-sm py-1 outline-none focus:border-terminal-green transition-colors resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-sm font-mono text-terminal-green-muted">
                &gt; failed to send —{" "}
                <a
                  href="mailto:zaroland95@gmail.com"
                  className="text-terminal-green hover:underline"
                >
                  try zaroland95@gmail.com
                </a>
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="border border-terminal-green px-4 py-1 text-sm hover:bg-terminal-green hover:text-terminal-bg transition-colors disabled:opacity-50"
            >
              {status === "sending" ? (
                <span className="loading-dots">sending</span>
              ) : (
                "send message"
              )}
            </button>
          </form>
        )}
      </div>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Visually verify the form panel**

With the dev server running (`npm run dev`), navigate to `http://localhost:5173/contact`. Verify:
- Form panel renders below the pitch panel
- `~/contact $ new-message` prompt appears above the form
- Name, email, and message fields render with underline-only borders
- Fields gain a brighter green bottom border on focus
- Submit button has the correct hover fill style
- Submitting with empty fields triggers native browser validation (required)

- [ ] **Step 4: Test the sending flow (requires real EmailJS credentials in .env)**

Fill in the form with a test name, your own email, and a test message. Click "send message". Verify:
- Button text changes to `sending...` with the animated dots during submission
- On success: form is replaced with `> message sent`
- Check your inbox — the email should arrive within a few seconds

- [ ] **Step 5: Test the error state (optional)**

Temporarily set `VITE_EMAILJS_SERVICE_ID` to an invalid value in `.env`, restart the dev server, and submit. Verify the error line `> failed to send — try zaroland95@gmail.com` appears with a working mailto link. Restore the correct value afterward.

- [ ] **Step 6: Production build check**

```bash
npm run build
```

Expected: build succeeds with no TypeScript or Vite errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Contact.tsx
git commit -m "feat: add contact form with EmailJS integration"
```
