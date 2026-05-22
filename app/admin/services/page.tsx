"use client";

import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ServiceRow = {
  id?: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  requirements?: string[] | string;
  pricing_deposit?: number;
  pricing_full?: number;
  pricing_booking_fee?: number;
  category: string;
  icon?: string;
  processing_time?: string;
  featured?: boolean;
  status?: string;
  sort_order?: number;
};

const CATEGORIES = ["documentation", "travel", "legal", "certification", "booking"];

const emptyService = (): ServiceRow => ({
  slug: "",
  title: "",
  short_description: "",
  description: "",
  requirements: "",
  pricing_deposit: 0,
  pricing_full: 0,
  pricing_booking_fee: 35000,
  category: "documentation",
  icon: "FileText",
  processing_time: "5–10 business days",
  featured: false,
  status: "active",
  sort_order: 0,
});

export default function AdminServicesPage() {
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [form, setForm] = useState<ServiceRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const importDefaults = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/services/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");
      toast.success(`Imported ${json.count} services from site defaults`);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setSeeding(false);
    }
  };

  const save = async () => {
    if (!form?.slug || !form.title) {
      toast.error("Slug and title are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements:
          typeof form.requirements === "string"
            ? form.requirements.split("\n").map((s) => s.trim()).filter(Boolean)
            : form.requirements,
      };
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success("Service saved");
      setForm(null);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      void load();
    } else {
      toast.error("Delete failed");
    }
  };

  const openEdit = (row: Record<string, unknown>) => {
    const reqs = row.requirements;
    setForm({
      id: row.id ? String(row.id) : undefined,
      slug: String(row.slug),
      title: String(row.title),
      short_description: String(row.short_description),
      description: String(row.description),
      requirements: Array.isArray(reqs) ? reqs.join("\n") : "",
      pricing_deposit: Number(row.pricing_deposit ?? 0),
      pricing_full: Number(row.pricing_full ?? 0),
      pricing_booking_fee: Number(row.pricing_booking_fee ?? 0),
      category: String(row.category),
      icon: String(row.icon ?? "FileText"),
      processing_time: String(row.processing_time ?? ""),
      featured: Boolean(row.featured),
      status: String(row.status ?? "active"),
      sort_order: Number(row.sort_order ?? 0),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Service management</h1>
          <p className="mt-1 text-sm text-slate-400">
            {rows.length} services — changes appear on /services and the home page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={importDefaults}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
          >
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Import site defaults
          </button>
          <button
            type="button"
            onClick={() => setForm(emptyService())}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add service
          </button>
        </div>
      </div>

      {rows.length === 0 && !loading && (
        <p className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
          No services in database yet. Click <strong>Import site defaults</strong> to load all current
          services from the website code
          from the website, or add a new one.
        </p>
      )}

      {form && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="font-semibold text-white">{form.id ? "Edit service" : "New service"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-slate-500">Slug (URL)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Title</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500">Short description</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500">Full description</label>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500">Requirements (one per line)</label>
              <textarea
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={typeof form.requirements === "string" ? form.requirements : ""}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Booking fee (NGN)</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.pricing_booking_fee ?? 0}
                onChange={(e) => setForm({ ...form, pricing_booking_fee: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Deposit (NGN)</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.pricing_deposit ?? 0}
                onChange={(e) => setForm({ ...form, pricing_deposit: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Full price (NGN)</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.pricing_full ?? 0}
                onChange={(e) => setForm({ ...form, pricing_full: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Category</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Icon (Lucide name)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.icon ?? ""}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Processing time</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.processing_time ?? ""}
                onChange={(e) => setForm({ ...form, processing_time: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.status ?? "active"}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500">Sort order</label>
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured on home page
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
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
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Loading…
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={String(row.id ?? row.slug)} className="border-b border-slate-800/80">
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{row.title}</p>
                  <p className="text-xs text-slate-500">{row.slug}</p>
                </td>
                <td className="px-4 py-3 text-slate-400">{row.category}</td>
                <td className="px-4 py-3 text-slate-400">{row.status}</td>
                <td className="px-4 py-3">{row.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="mr-2 text-blue-400 hover:underline"
                    onClick={() => openEdit(row as Record<string, unknown>)}
                  >
                    Edit
                  </button>
                  {row.id && (
                    <button type="button" onClick={() => remove(String(row.id))}>
                      <Trash2 className="inline h-3.5 w-3.5 text-red-400" />
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
