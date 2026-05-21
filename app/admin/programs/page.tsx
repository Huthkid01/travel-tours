"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ProgramRow = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  optional_price?: number | null;
  status: string;
  cta_link?: string;
  badge?: string | null;
  sort_order?: number;
};

const emptyProgram = (): ProgramRow => ({
  slug: "",
  title: "",
  description: "",
  image: "/programs/flyers/placeholder.png",
  status: "active",
  cta_link: "/consultation",
  sort_order: 0,
});

export default function AdminProgramsPage() {
  const [rows, setRows] = useState<ProgramRow[]>([]);
  const [form, setForm] = useState<ProgramRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/programs");
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!form?.slug || !form.title) {
      toast.error("Slug and title are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success("Program saved");
      setForm(null);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this program?")) return;
    const res = await fetch(`/api/admin/programs?id=${id}`, { method: "DELETE" });
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
          <h1 className="font-display text-2xl font-bold text-white">Program Management</h1>
          <p className="mt-1 text-sm text-slate-400">Updates appear on the home page and /programs.</p>
        </div>
        <button
          type="button"
          onClick={() => setForm(emptyProgram())}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          Add Program
        </button>
      </div>

      {form && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">{form.id ? "Edit" : "New"} Program</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                ["slug", "Slug (url)"],
                ["title", "Title"],
                ["image", "Image path or URL"],
                ["cta_link", "CTA link"],
                ["badge", "Badge"],
                ["sort_order", "Sort order"],
                ["optional_price", "Price (NGN)"],
                ["status", "Status (active/draft/archived)"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-slate-500">{label}</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                  value={String(form[key as keyof ProgramRow] ?? "")}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]:
                        key === "sort_order" || key === "optional_price"
                          ? e.target.value
                            ? Number(e.target.value)
                            : null
                          : e.target.value,
                    })
                  }
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500">Description</label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id || row.slug} className="border-b border-slate-800/80">
                <td className="px-4 py-3 text-white">{row.title}</td>
                <td className="px-4 py-3 text-slate-400">{row.slug}</td>
                <td className="px-4 py-3 text-slate-400">{row.status}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="mr-2 text-blue-400 hover:underline"
                    onClick={() => setForm(row as ProgramRow)}
                  >
                    Edit
                  </button>
                  {row.id && (
                    <button
                      type="button"
                      className="text-red-400 hover:underline"
                      onClick={() => remove(row.id!)}
                    >
                      <Trash2 className="inline h-3.5 w-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
