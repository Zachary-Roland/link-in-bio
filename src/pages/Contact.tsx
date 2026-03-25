import { useEffect, useRef, useState } from "react";
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
  const successRef = useRef<HTMLParagraphElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    <div className="max-w-2xl mx-auto py-6 md:py-12 px-4 space-y-6">
      <h1 className="text-2xl font-bold">~/contact</h1>

      {/* Pitch panel */}
      <div className="border border-terminal-green-muted rounded-lg p-4 md:p-6 space-y-4 md:space-y-5">
        <div>
          <p className="text-terminal-green-muted text-xs font-mono mb-1">
            ~/freelance $ status --available
          </p>
          <p className="text-terminal-green text-sm font-mono">&gt; accepting new clients</p>
        </div>
        <p className="text-2xl font-bold">I&apos;ll build your website.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 pt-1">
          {stats.map((stat) => (
            <div key={stat.value} className="space-y-1">
              <p className="text-2xl md:text-3xl font-bold text-terminal-green">{stat.value}</p>
              <p className="text-xs text-terminal-green-muted leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2 py-0.5 border border-terminal-green rounded text-terminal-green"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="bg-white rounded-lg p-6 space-y-5 shadow-sm">
        <h2 className="text-gray-900 font-bold text-lg">Let&apos;s work together</h2>

        {status === "sent" ? (
          <p ref={successRef} role="status" tabIndex={-1} className="text-green-700 font-mono text-sm outline-none">
            &gt; message sent — I&apos;ll be in touch soon.
          </p>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="from_name" className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Name
              </label>
              <input
                id="from_name"
                name="from_name"
                type="text"
                required
                autoComplete="name"
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-terminal-green focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="reply_to" className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Email
              </label>
              <input
                id="reply_to"
                name="reply_to"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-terminal-green focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={2000}
                placeholder="Tell me about your project..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-terminal-green focus:border-transparent transition-all resize-none"
              />
            </div>

            {status === "error" && (
              <p role="alert" className="text-sm text-red-600">
                Failed to send —{" "}
                <a href="mailto:zaroland95@gmail.com" className="underline hover:text-red-800">
                  email me directly
                </a>
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full bg-terminal-green text-terminal-bg font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
            >
              {status === "sending" ? (
                <span className="loading-dots">Sending</span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
