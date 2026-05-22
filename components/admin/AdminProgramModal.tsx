"use client";

import { ProgramImageUpload } from "@/components/admin/ProgramImageUpload";
import { slugFromTitle } from "@/lib/admin-program-image";
import { getProgramFlyerPath } from "@/lib/program-flyers";
import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

export type AdminProgramForm = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  optional_price?: number | null;
  status: string;
  cta_link: string;
  badge?: string | null;
  sort_order: number;
};

export const emptyAdminProgram = (): AdminProgramForm => ({
  slug: "",
  title: "",
  description: "",
  image: "",
  status: "active",
  cta_link: "/consultation",
  badge: null,
  sort_order: 0,
});

interface AdminProgramModalProps {
  open: boolean;
  initial: AdminProgramForm | null;
  saving: boolean;
  onClose: () => void;
  onSave: (form: AdminProgramForm) => void;
}

export function AdminProgramModal({ open, initial, saving, onClose, onSave }: AdminProgramModalProps) {
  const [form, setForm] = useState<AdminProgramForm>(emptyAdminProgram());

  useEffect(() => {
    if (!open) return;
    setForm(initial ?? emptyAdminProgram());
  }, [open, initial]);

  if (!open) return null;

  const isEdit = Boolean(form.id);
  const slugTouched = form.slug.length > 0;

  const updateSlugFromTitle = () => {
    if (!form.title.trim()) return;
    setForm((f) => ({ ...f, slug: slugFromTitle(f.title) }));
  };

  const handleSave = () => {
    const payload = {
      ...form,
      image: form.image.trim() || getProgramFlyerPath(form.slug || "program"),
      cta_link: form.cta_link || `/consultation?program=${form.slug}`,
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div
        className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="program-modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 id="program-modal-title" className="font-display text-xl font-bold text-white">
              {isEdit ? "Edit program" : "Add program"}
            </h2>
            <p className="text-sm text-slate-400">Flyer, details, and publishing — saved to Supabase</p>
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

        <div className="max-h-[min(70vh,720px)] space-y-8 overflow-y-auto px-6 py-6">
          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <ProgramImageUpload
              image={form.image}
              slug={form.slug || slugFromTitle(form.title) || "program"}
              onImageChange={(url) => setForm((f) => ({ ...f, image: url }))}
            />
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Basic information</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-500">Program title *</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  onBlur={() => {
                    if (!slugTouched && form.title) updateSlugFromTitle();
                  }}
                  placeholder="Serbia — Warehouse Jobs & Work Permits"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">URL slug *</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="serbia-warehouse-jobs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Badge (optional)</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                  value={form.badge ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value || null }))}
                  placeholder="Featured, New, Popular…"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Description</h3>
            <textarea
              rows={5}
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Full program description shown on the website…"
            />
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Links & display</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-500">Apply / CTA link</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                  value={form.cta_link}
                  onChange={(e) => setForm((f) => ({ ...f, cta_link: e.target.value }))}
                  placeholder="/consultation?program=..."
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Price (NGN, optional)</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                  value={form.optional_price ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      optional_price: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Sort order</label>
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                  value={form.sort_order}
                  onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Publishing</h3>
            <div className="mt-4">
              <label className="text-xs text-slate-500">Status</label>
              <select
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="active">Active (visible on site)</option>
                <option value="draft">Draft (hidden)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
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
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEdit ? "Update program" : "Create program"}
          </button>
        </div>
      </div>
    </div>
  );
}
