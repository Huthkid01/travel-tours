"use client";

import { AdminServiceModal, type AdminServiceForm } from "@/components/admin/AdminServiceModal";
import { cn } from "@/lib/utils";
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ServiceRow = AdminServiceForm & { id?: string };

function rowToForm(row: Record<string, unknown>): AdminServiceForm {
  const reqs = row.requirements;
  return {
    id: row.id ? String(row.id) : undefined,
    slug: String(row.slug),
    title: String(row.title),
    short_description: String(row.short_description),
    description: String(row.description),
    requirements: Array.isArray(reqs) ? (reqs as string[]).join("\n") : String(reqs ?? ""),
    pricing_deposit: Number(row.pricing_deposit ?? 0),
    pricing_full: Number(row.pricing_full ?? 0),
    pricing_booking_fee: Number(row.pricing_booking_fee ?? 0),
    category: String(row.category),
    icon: String(row.icon ?? "FileText"),
    processing_time: String(row.processing_time ?? ""),
    featured: Boolean(row.featured),
    status: String(row.status ?? "active"),
    sort_order: Number(row.sort_order ?? 0),
  };
}

function statusBadge(status: string) {
  const s = status?.toLowerCase() || "active";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        s === "active" && "bg-emerald-500/20 text-emerald-400",
        s === "draft" && "bg-amber-500/20 text-amber-400",
        s === "archived" && "bg-slate-500/20 text-slate-400"
      )}
    >
      {s}
    </span>
  );
}

export default function AdminServicesPage() {
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminServiceForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load services");
      setRows(Array.isArray(data) ? data.map((r) => rowToForm(r as Record<string, unknown>)) : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load services");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      r.slug.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: ServiceRow) => {
    setEditing(row);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

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

  const save = async (form: AdminServiceForm) => {
    if (!form.slug?.trim() || !form.title?.trim()) {
      toast.error("Slug and title are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success(form.id ? "Service updated" : "Service created");
      closeModal();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Service Management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage all services ({rows.length} total). Click Add or Edit to open the popup.
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
            Import site defaults
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <input
          type="search"
          placeholder="Search by title, slug, or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Booking fee</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No services found. Import site defaults or add one.
                </td>
              </tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id ?? row.slug} className="border-b border-slate-800/80 hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{row.title}</p>
                  <p className="font-mono text-xs text-slate-500">{row.slug}</p>
                </td>
                <td className="px-4 py-3 capitalize text-slate-400">{row.category}</td>
                <td className="px-4 py-3 text-slate-400">
                  ₦{Number(row.pricing_booking_fee ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-3">{statusBadge(row.status)}</td>
                <td className="px-4 py-3 text-slate-400">{row.featured ? "Yes" : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="rounded-lg bg-blue-600/20 p-2 text-blue-400 hover:bg-blue-600/30"
                      aria-label="Edit service"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {row.id && (
                      <button
                        type="button"
                        onClick={() => remove(row.id!)}
                        className="rounded-lg bg-red-600/20 p-2 text-red-400 hover:bg-red-600/30"
                        aria-label="Delete service"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminServiceModal
        open={modalOpen}
        initial={editing}
        saving={saving}
        onClose={closeModal}
        onSave={save}
      />
    </div>
  );
}
