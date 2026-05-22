"use client";

import { AdminProgramModal, type AdminProgramForm } from "@/components/admin/AdminProgramModal";
import { resolveProgramImageSrc } from "@/lib/admin-program-image";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type ProgramRow = AdminProgramForm & { id?: string };

function rowToForm(row: ProgramRow): AdminProgramForm {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image || "",
    optional_price: row.optional_price ?? null,
    status: row.status || "active",
    cta_link: row.cta_link || "",
    badge: row.badge ?? null,
    sort_order: row.sort_order ?? 0,
  };
}

function ProgramThumb({ image, title }: { image?: string; title: string }) {
  const src = resolveProgramImageSrc(image);
  if (!src) {
    return (
      <div className="flex h-14 w-10 items-center justify-center rounded-md border border-dashed border-slate-600 bg-slate-950 text-slate-600">
        <ImageIcon className="h-4 w-4" />
      </div>
    );
  }
  return (
    <div className="relative h-14 w-10 overflow-hidden rounded-md border border-slate-700 bg-slate-950">
      <Image src={src} alt={title} fill className="object-cover" unoptimized sizes="40px" />
    </div>
  );
}

export default function AdminProgramsPage() {
  const [rows, setRows] = useState<ProgramRow[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProgramForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");

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

  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.title?.toLowerCase().includes(q) ||
      r.slug?.toLowerCase().includes(q) ||
      r.image?.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: ProgramRow) => {
    setEditing(rowToForm(row));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const importDefaults = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/programs/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");
      toast.success(`Imported ${json.count} programs (Serbia, France, Turkey, etc.)`);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setSeeding(false);
    }
  };

  const save = async (form: AdminProgramForm) => {
    if (!form.slug?.trim() || !form.title?.trim()) {
      toast.error("Slug and title are required");
      return;
    }
    if (!form.image?.trim()) {
      toast.error("Add a flyer image (upload or paste a path/URL)");
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
      toast.success(form.id ? "Program updated" : "Program created");
      closeModal();
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

  const statusBadge = (status: string) => {
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
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Program Management</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage featured programs ({rows.length} total). Flyer images are stored in Supabase and shown on the site.
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
            Import all site programs
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add Program
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <input
          type="search"
          placeholder="Search programs by title, slug, or image path…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Flyer</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Badge</th>
              <th className="px-4 py-3">Image (database)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  No programs found. Import site programs or add one.
                </td>
              </tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id || row.slug} className="border-b border-slate-800/80 hover:bg-slate-800/30">
                <td className="px-4 py-3">
                  <ProgramThumb image={row.image} title={row.title} />
                </td>
                <td className="max-w-[200px] px-4 py-3 font-medium text-white">{row.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{row.slug}</td>
                <td className="px-4 py-3 text-slate-400">{row.badge || "—"}</td>
                <td className="max-w-[220px] truncate px-4 py-3 font-mono text-[11px] text-slate-500" title={row.image}>
                  {row.image || "—"}
                </td>
                <td className="px-4 py-3">{statusBadge(row.status)}</td>
                <td className="px-4 py-3 text-slate-400">{row.sort_order ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="rounded-lg bg-blue-600/20 p-2 text-blue-400 hover:bg-blue-600/30"
                      aria-label="Edit program"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {row.id && (
                      <button
                        type="button"
                        onClick={() => remove(row.id!)}
                        className="rounded-lg bg-red-600/20 p-2 text-red-400 hover:bg-red-600/30"
                        aria-label="Delete program"
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

      <AdminProgramModal
        open={modalOpen}
        initial={editing}
        saving={saving}
        onClose={closeModal}
        onSave={save}
      />
    </div>
  );
}
