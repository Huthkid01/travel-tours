"use client";

import type { Testimonial } from "@/types";
import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

export type AdminTestimonialForm = {
  id?: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  service: string;
  active: boolean;
  sortOrder: number;
};

export const emptyAdminTestimonial = (sortOrder = 0): AdminTestimonialForm => ({
  name: "",
  role: "",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
  rating: 5,
  text: "",
  service: "",
  active: true,
  sortOrder,
});

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600";
const labelClass = "text-xs text-slate-500";

interface AdminTestimonialModalProps {
  open: boolean;
  initial: AdminTestimonialForm | null;
  saving: boolean;
  onClose: () => void;
  onSave: (form: AdminTestimonialForm) => void;
}

export function AdminTestimonialModal({
  open,
  initial,
  saving,
  onClose,
  onSave,
}: AdminTestimonialModalProps) {
  const [form, setForm] = useState<AdminTestimonialForm>(emptyAdminTestimonial());

  useEffect(() => {
    if (!open) return;
    setForm(initial ?? emptyAdminTestimonial());
  }, [open, initial]);

  if (!open) return null;

  const isEdit = Boolean(form.id);

  const handleSave = () => {
    onSave({
      ...form,
      name: form.name.trim(),
      text: form.text.trim(),
      avatar: form.avatar.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="testimonial-modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 id="testimonial-modal-title" className="font-display text-xl font-bold text-white">
              {isEdit ? "Edit testimonial" : "Add testimonial"}
            </h2>
            <p className="text-sm text-slate-400">Homepage — &ldquo;What Our Clients Say&rdquo; carousel</p>
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
            <h3 className="text-sm font-semibold text-white">Client</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Adaeze Okonkwo"
                />
              </div>
              <div>
                <label className={labelClass}>Role / title</label>
                <input
                  className={inputClass}
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  placeholder="Business Owner"
                />
              </div>
              <div>
                <label className={labelClass}>Service mentioned</label>
                <input
                  className={inputClass}
                  value={form.service}
                  onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                  placeholder="Proof of Fund"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>
                  Avatar image URL <span className="text-red-400">*</span>
                </label>
                <input
                  className={inputClass}
                  value={form.avatar}
                  onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Review</h3>
            <label className={`mt-4 block ${labelClass}`}>
              Testimonial text <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              className={inputClass}
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              placeholder="What the client said about Darboi Consults..."
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Star rating (1–5)</label>
                <select
                  className={inputClass}
                  value={form.rating}
                  onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
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
              Active (show on homepage carousel)
            </label>
          </section>

          {form.text.trim() && (
            <div className="rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold-400">Preview</p>
              <p className="mt-2 text-sm italic text-white">&ldquo;{form.text}&rdquo;</p>
              <p className="mt-2 text-xs text-slate-400">
                — {form.name || "Name"}, {form.role || "Role"}
              </p>
            </div>
          )}
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
            disabled={saving || !form.name.trim() || !form.text.trim() || !form.avatar.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEdit ? "Update testimonial" : "Add testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
}
