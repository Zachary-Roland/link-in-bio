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
    </div>
  );
}
