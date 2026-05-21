"use client";

import type { Announcement } from "@/types";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminAnnouncementsPage() {
  const [rows, setRows] = useState<Announcement[]>([]);
  const [form, setForm] = useState<Partial<Announcement> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/announcements");
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Announcements</h1>
          <p className="mt-1 text-sm text-slate-400">Top banner messages on the public site.</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ message: "", type: "notice", active: true, sortOrder: 0 })}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {form && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 space-y-3">
          <input
            placeholder="Message"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            value={form.message ?? ""}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <input
            placeholder="Link (optional)"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            value={form.link ?? ""}
            onChange={(e) => setForm({ ...form, link: e.target.value || null })}
          />
          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white"
            value={form.type ?? "notice"}
            onChange={(e) => setForm({ ...form, type: e.target.value as Announcement["type"] })}
          >
            <option value="notice">Notice</option>
            <option value="promo">Promo</option>
            <option value="service">Service</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </button>
            <button type="button" onClick={() => setForm(null)} className="text-slate-400 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {loading && <p className="text-slate-500">Loading…</p>}
        {rows.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-4 py-3"
          >
            <div>
              <p className="text-white">{a.message}</p>
              <p className="text-xs text-slate-500">
                {a.type} · {a.active ? "active" : "inactive"}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-blue-400 text-sm" onClick={() => setForm(a)}>
                Edit
              </button>
              <button type="button" onClick={() => remove(a.id)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
