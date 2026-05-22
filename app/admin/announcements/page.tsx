"use client";

import {
  AdminAnnouncementModal,
  emptyAdminAnnouncement,
  type AdminAnnouncementForm,
} from "@/components/admin/AdminAnnouncementModal";
import type { Announcement } from "@/types";
import { cn } from "@/lib/utils";
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function rowToForm(row: Announcement): AdminAnnouncementForm {
  return {
    id: row.id,
    message: row.message,
    type: row.type,
    link: row.link ?? null,
    active: row.active,
    sortOrder: row.sortOrder ?? 0,
  };
}

function typeBadge(type: string) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        type === "promo" && "bg-purple-500/20 text-purple-300",
        type === "service" && "bg-blue-500/20 text-blue-300",
        type === "notice" && "bg-slate-500/20 text-slate-700 dark:text-slate-300"
      )}
    >
      {type}
    </span>
  );
}

export default function AdminAnnouncementsPage() {
  const [rows, setRows] = useState<Announcement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAnnouncementForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState("");

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

  const filtered = rows.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.message.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      (r.link ?? "").toLowerCase().includes(q)
    );
  });

  const openAdd = () => {
    setEditing(emptyAdminAnnouncement(rows.length));
    setModalOpen(true);
  };

  const openEdit = (row: Announcement) => {
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

  const save = async (form: AdminAnnouncementForm) => {
    if (!form.message.trim()) {
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
      toast.success(form.id ? "Announcement updated" : "Announcement created");
      closeModal();
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
          <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Announcement Management</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage top banner messages ({rows.length} total). Click Add or Edit to open the popup.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={importDefaults}
            disabled={seeding}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-60"
          >
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Import site announcements
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add Announcement
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <input
          type="search"
          placeholder="Search by message, type, or link…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Link</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sort</th>
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
                  No announcements found. Import site announcements or add one.
                </td>
              </tr>
            )}
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800/80 dark:hover:bg-slate-800/30">
                <td className="max-w-[320px] px-4 py-3 font-medium text-slate-900 dark:text-white">{row.message}</td>
                <td className="px-4 py-3">{typeBadge(row.type)}</td>
                <td className="max-w-[180px] truncate px-4 py-3 font-mono text-xs text-slate-500" title={row.link ?? ""}>
                  {row.link || "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                      row.active ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-500/20 text-slate-400"
                    )}
                  >
                    {row.active ? "active" : "hidden"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">{row.sortOrder ?? 0}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="rounded-lg bg-blue-600/20 p-2 text-blue-400 hover:bg-blue-600/30"
                      aria-label="Edit announcement"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(row.id)}
                      className="rounded-lg bg-red-600/20 p-2 text-red-400 hover:bg-red-600/30"
                      aria-label="Delete announcement"
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

      <AdminAnnouncementModal
        open={modalOpen}
        initial={editing}
        saving={saving}
        onClose={closeModal}
        onSave={save}
      />
    </div>
  );
}
