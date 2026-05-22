"use client";

import {
  AdminTestimonialModal,
  emptyAdminTestimonial,
  type AdminTestimonialForm,
} from "@/components/admin/AdminTestimonialModal";
import { adminBtnSecondary, adminH1, adminSubtitle, adminTableHead, adminTableRow, adminTableWrap } from "@/lib/admin-ui";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";
import { Loader2, Pencil, Plus, Star, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function rowToForm(row: Testimonial): AdminTestimonialForm {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    avatar: row.avatar,
    rating: row.rating,
    text: row.text,
    service: row.service,
    active: row.active ?? true,
    sortOrder: row.sortOrder ?? 0,
  };
}

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminTestimonialForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load testimonials");
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
      r.name.toLowerCase().includes(q) ||
      r.text.toLowerCase().includes(q) ||
      r.service.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditing(emptyAdminTestimonial(rows.length));
    setModalOpen(true);
  };

  const openEdit = (row: Testimonial) => {
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
      const res = await fetch("/api/admin/testimonials/seed", { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Import failed");
      toast.success(`Imported ${json.count} testimonials from site defaults`);
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setSeeding(false);
    }
  };

  const save = async (form: AdminTestimonialForm) => {
    if (!form.name.trim() || !form.text.trim() || !form.avatar.trim()) {
      toast.error("Name, testimonial text, and avatar URL are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      toast.success(form.id ? "Testimonial updated" : "Testimonial added");
      closeModal();
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted");
      void load();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className={adminH1}>Testimonials</h1>
          <p className={adminSubtitle}>
            Homepage &ldquo;What Our Clients Say&rdquo; carousel ({rows.length} total). Add, edit, or hide reviews.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={importDefaults}
            disabled={seeding}
            className={adminBtnSecondary}
          >
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Import defaults
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add testimonial
          </button>
        </div>
      </div>

      <input
        type="search"
        placeholder="Search by name, service, or text…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />

      <p className="text-xs text-slate-500 sm:hidden">Swipe the table to see all columns.</p>
      <div className={adminTableWrap}>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className={adminTableHead}>
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Quote</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  No testimonials yet. Import defaults or add one.
                </td>
              </tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id} className={adminTableRow}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900 dark:text-white">{row.name}</p>
                  <p className="text-xs text-slate-500">{row.role}</p>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.service || "—"}</td>
                <td className="max-w-[240px] px-4 py-3 text-slate-600 dark:text-slate-400">
                  <p className="line-clamp-2">{row.text}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-0.5 text-gold-500">
                    {row.rating}
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      row.active !== false
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-500/20 text-slate-500"
                    )}
                  >
                    {row.active !== false ? "active" : "hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{row.sortOrder ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="rounded-lg bg-blue-600/20 p-2 text-blue-600 hover:bg-blue-600/30 dark:text-blue-400"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(row.id)}
                      className="rounded-lg bg-red-600/20 p-2 text-red-600 hover:bg-red-600/30 dark:text-red-400"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminTestimonialModal
        open={modalOpen}
        initial={editing}
        saving={saving}
        onClose={closeModal}
        onSave={save}
      />
    </div>
  );
}
