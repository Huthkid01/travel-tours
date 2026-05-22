"use client";

import { slugFromTitle } from "@/lib/admin-program-image";
import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

export type AdminServiceForm = {
  id?: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  requirements: string;
  pricing_deposit: number;
  pricing_full: number;
  pricing_booking_fee: number;
  category: string;
  icon: string;
  processing_time: string;
  featured: boolean;
  status: string;
  sort_order: number;
};

const CATEGORIES = ["documentation", "travel", "legal", "certification", "booking"] as const;

export const emptyAdminService = (): AdminServiceForm => ({
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

interface AdminServiceModalProps {
  open: boolean;
  initial: AdminServiceForm | null;
  saving: boolean;
  onClose: () => void;
  onSave: (form: AdminServiceForm) => void;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-600";
const labelClass = "text-xs text-slate-500";

export function AdminServiceModal({
  open,
  initial,
  saving,
  onClose,
  onSave,
}: AdminServiceModalProps) {
  const [form, setForm] = useState<AdminServiceForm>(emptyAdminService());
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(initial ?? emptyAdminService());
    setSlugTouched(Boolean(initial?.slug));
  }, [open, initial]);

  if (!open) return null;

  const isEdit = Boolean(form.id);

  const updateSlugFromTitle = () => {
    if (!form.title.trim() || slugTouched) return;
    setForm((f) => ({ ...f, slug: slugFromTitle(f.title) }));
  };

  const handleSave = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8">
      <div
        className="my-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-modal-title"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h2 id="service-modal-title" className="font-display text-xl font-bold text-white">
              {isEdit ? "Edit service" : "Add service"}
            </h2>
            <p className="text-sm text-slate-400">Details, pricing, and publishing — saved automatically</p>
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

        <div className="max-h-[min(70vh,720px)] space-y-6 overflow-y-auto px-6 py-6">
          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Basic information</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Service title *</label>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  onBlur={updateSlugFromTitle}
                  placeholder="Proof of Funds Documentation"
                />
              </div>
              <div>
                <label className={labelClass}>URL slug *</label>
                <input
                  className={inputClass}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  placeholder="proof-of-funds"
                />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Short description *</label>
                <input
                  className={inputClass}
                  value={form.short_description}
                  onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))}
                  placeholder="One line shown on service cards"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Full description</h3>
            <textarea
              rows={4}
              className={`${inputClass} mt-3`}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Full service description on the service page…"
            />
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Requirements</h3>
            <p className="mt-0.5 text-xs text-slate-500">One requirement per line</p>
            <textarea
              rows={4}
              className={`${inputClass} mt-3`}
              value={form.requirements}
              onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))}
              placeholder={"Valid international passport\nBank statements (6 months)"}
            />
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Pricing (NGN)</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Booking fee</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.pricing_booking_fee}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pricing_booking_fee: Number(e.target.value) || 0 }))
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Deposit</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.pricing_deposit}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pricing_deposit: Number(e.target.value) || 0 }))
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Full price</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.pricing_full}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, pricing_full: Number(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-950/50 p-5">
            <h3 className="text-sm font-semibold text-white">Display & publishing</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Icon (Lucide name)</label>
                <input
                  className={inputClass}
                  value={form.icon}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="FileText, Plane, Scale…"
                />
              </div>
              <div>
                <label className={labelClass}>Processing time</label>
                <input
                  className={inputClass}
                  value={form.processing_time}
                  onChange={(e) => setForm((f) => ({ ...f, processing_time: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Sort order</label>
                <input
                  type="number"
                  className={inputClass}
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))
                  }
                />
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option value="active">Active (visible on site)</option>
                  <option value="draft">Draft (hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-600"
                />
                Featured on home page
              </label>
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
            disabled={saving || !form.slug.trim() || !form.title.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEdit ? "Update service" : "Create service"}
          </button>
        </div>
      </div>
    </div>
  );
}
