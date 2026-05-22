"use client";

import type { Announcement } from "@/types";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminAnnouncementsPage() {
  const [rows, setRows] = useState<Announcement[]>([]);
  const [form, setForm] = useState<Partial<Announcement> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load announcements");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load announcements");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const importDefaults = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/announcements/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");
      toast.success(`Imported ${json.count} announcements from the live site defaults`);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setSeeding(false);
    }
  };

  const save = async () => {
    if (!form?.message?.trim()) {
      toast.error("Message is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success("Announcement saved");
      setForm(null);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      void load();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Announcements</h1>
          <p className="mt-1 text-sm text-slate-400">
            Top banner and ticker messages on the public site. Edits here update the live site after deploy.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={importDefaults}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-60"
          >
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Import site announcements
          </button>
          <button
            type="button"
            onClick={() =>
              setForm({ message: "", type: "notice", active: true, sortOrder: rows.length, link: null })
            }
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {form && (
        <div className="space-y-3 rounded-xl border border-slate-700 bg-slate-900 p-6">
          <input
            placeholder="Message *"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            value={form.message ?? ""}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <input
            placeholder="Link (optional, e.g. /programs/serbia-warehouse-jobs)"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            value={form.link ?? ""}
            onChange={(e) => setForm({ ...form, link: e.target.value || null })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              value={form.type ?? "notice"}
              onChange={(e) => setForm({ ...form, type: e.target.value as Announcement["type"] })}
            >
              <option value="notice">Notice</option>
              <option value="promo">Promo</option>
              <option value="service">Service</option>
            </select>
            <input
              type="number"
              placeholder="Sort order"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              value={form.sortOrder ?? 0}
              onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) || 0 })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active (visible on site)
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </button>
            <button type="button" onClick={() => setForm(null)} className="text-sm text-slate-400">
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {loading && (
          <li className="py-8 text-center text-slate-500">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          </li>
        )}
        {!loading && rows.length === 0 && (
          <li className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-10 text-center">
            <p className="text-slate-300">No announcements in the database yet.</p>
            <p className="mt-2 text-sm text-slate-500">
              Click <strong className="text-slate-400">Import site announcements</strong> to load the 4 default
              messages (appointment booking, Serbia jobs, office hours, France/Turkey visas), then edit or add more.
            </p>
          </li>
        )}
        {rows.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-white">{a.message}</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {a.type} · sort {a.sortOrder ?? 0} · {a.active ? "active" : "hidden"}
                {a.link ? ` · ${a.link}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-sm text-blue-400 hover:underline" onClick={() => setForm(a)}>
                Edit
              </button>
              <button type="button" onClick={() => remove(a.id)} aria-label="Delete">
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
