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
  const [billing, setBilling] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [error, setError] = useState("");

  function startEdit(show: Show) {
    setEditing(show);
    setDate(show.date.toDate().toISOString().split("T")[0] ?? "");
    setBilling(show.billing ?? "");
    setVenue(show.venue);
    setCity(show.city);
    setTicketUrl(show.ticketUrl !== undefined ? show.ticketUrl : "");
  }

  function resetForm() {
    setEditing(null);
    setDate("");
    setBilling("");
    setVenue("");
    setCity("");
    setTicketUrl("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const data = {
        date: Timestamp.fromDate(new Date(date + "T00:00:00")),
        billing,
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
    } catch (err) {
      setError(`Failed to save show: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this show?")) return;
    setError("");
    try {
      await deleteDoc(doc(db, "shows", id));
    } catch (err) {
      setError(`Failed to delete show: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  const now = new Date();

  return (
    <div className="space-y-8">
      {error && (
        <div className="border border-red-400 rounded px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
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
          placeholder="Billing (e.g. Wedding, Bokr Tov w/ Big Nope)"
          value={billing}
          onChange={(e) => setBilling(e.target.value)}
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
                  {show.billing} — {show.venue}, {show.city}
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
