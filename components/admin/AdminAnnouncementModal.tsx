"use client";

import { buildProgramCtaLink, normalizeAnnouncementLink } from "@/lib/admin-links";
import type { Announcement } from "@/types";
import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

export type AdminAnnouncementForm = {
  id?: string;
  message: string;
  type: Announcement["type"];
  link: string | null;
  active: boolean;
  sortOrder: number;
};

export const emptyAdminAnnouncement = (sortOrder = 0): AdminAnnouncementForm => ({
  message: "",
  type: "notice",
  link: null,
  active: true,
  sortOrder,
});

interface AdminAnnouncementModalProps {
  open: boolean;
  initial: AdminAnnouncementForm | null;
  saving: boolean;
  onClose: () => void;
  onSave: (form: AdminAnnouncementForm) => void;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600";
const labelClass = "text-xs text-slate-500";

export function AdminAnnouncementModal({
  open,
  initial,
  saving,
  onClose,
  onSave,
}: AdminAnnouncementModalProps) {
  const [form, setForm] = useState<AdminAnnouncementForm>(emptyAdminAnnouncement());
  const [programSlug, setProgramSlug] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm(initial ?? emptyAdminAnnouncement());
    setProgramSlug("");
  }, [open, initial]);

  if (!open) return null;

  const isEdit = Boolean(form.id);

  const handleSave = () => {
    const customLink = form.link?.trim();
    let link = customLink;
    if (!link && programSlug.trim()) {
      link = buildProgramCtaLink(programSlug);
    } else if (!link) {
      link = normalizeAnnouncementLink(null, { type: form.type }) ?? "/consultation";
    }

    onSave({
      ...form,
      message: form.message.trim(),
      link,
    });
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 id="announcement-modal-title" className="font-display text-xl font-bold text-white">
              {isEdit ? "Edit announcement" : "Add announcement"}
            </h2>
            <p className="text-sm text-slate-400">Banner & ticker on the public site — saved to Supabase</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[min(70vh,640px)] space-y-6 overflow-y-auto px-6 py-6">
          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Message</h3>
            <p className="mt-0.5 text-xs text-slate-500">Shown in the top announcement bar and ticker</p>
            <label className={`mt-4 block ${labelClass}`}>
              Announcement text <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              className={inputClass}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="e.g. Serbia warehouse jobs & work permits — apply now"
            />
            {form.message.trim() && (
              <div className="mt-4 rounded-lg border border-gold-500/30 bg-gold-500/10 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gold-400">Preview</p>
                <p className="mt-1 text-sm text-white">{form.message}</p>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Link & category</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Link (optional)</label>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Leave blank to auto-generate from program slug below, or by type (promo → /programs,
                  service → /services)
                </p>
                <input
                  className={inputClass}
                  value={form.link ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value || null }))}
                  placeholder="/programs/serbia-warehouse-jobs or /consultation?program=..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Program slug (for auto link)</label>
                <input
                  className={inputClass}
                  value={programSlug}
                  onChange={(e) => setProgramSlug(e.target.value)}
                  placeholder="serbia-warehouse-jobs — used only if link is blank"
                />
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value as Announcement["type"] }))
                  }
                >
                  <option value="notice">Notice</option>
                  <option value="promo">Promo</option>
                  <option value="service">Service</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Sort order</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Publishing</h3>
            <label className="mt-4 flex cursor-pointer items-center gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-600"
              />
              Active (visible on the public site)
            </label>
          </section>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !form.message.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEdit ? "Update announcement" : "Create announcement"}
          </button>
        </div>
      </div>
    </div>
  );
}
