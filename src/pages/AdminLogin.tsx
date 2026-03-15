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
