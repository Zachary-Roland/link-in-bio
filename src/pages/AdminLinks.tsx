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
