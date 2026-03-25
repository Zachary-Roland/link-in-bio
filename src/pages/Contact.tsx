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
      <form ref={formRef} onSubmit={handleSubmit} className="hidden" aria-hidden>
        {status === "idle" && null}
      </form>
    </div>
  );
}
