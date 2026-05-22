"use client";

import { formatPrice } from "@/lib/utils";
import type { Application } from "@/types";
import { ExternalLink, X } from "lucide-react";
import type { ReactNode } from "react";

interface AdminApplicationViewModalProps {
  application: Application | null;
  onClose: () => void;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  if (value == null || value === "") return null;
  return (
    <div className="grid gap-1 border-b border-slate-800 py-3 sm:grid-cols-[140px_1fr]">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-200 break-words whitespace-pre-wrap">{value}</dd>
    </div>
  );
}

export function AdminApplicationViewModal({ application, onClose }: AdminApplicationViewModalProps) {
  if (!application) return null;

  const app = application;
  const paid = app.payment_status === "paid";

  return (
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="application-view-title"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-4">
          <div className="min-w-0">
            <h2 id="application-view-title" className="font-display text-xl font-bold text-white">
              Application details
            </h2>
            <p className="mt-1 truncate text-sm text-slate-400">{app.service_name}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Submitted {new Date(app.created_at).toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[min(75vh,720px)] overflow-y-auto px-6 py-2">
          <section className="rounded-xl border border-slate-800 bg-slate-950/50 px-4">
            <h3 className="border-b border-slate-800 py-3 text-sm font-semibold text-white">Applicant</h3>
            <dl>
              <DetailRow label="Full name" value={app.full_name} />
              <DetailRow label="Email" value={
                <a href={`mailto:${app.email}`} className="text-gold-400 hover:underline">
                  {app.email}
                </a>
              } />
              <DetailRow label="Phone" value={
                <a href={`tel:${app.phone}`} className="text-gold-400 hover:underline">
                  {app.phone}
                </a>
              } />
              <DetailRow label="Country" value={app.country} />
              <DetailRow label="Address" value={app.address} />
              <DetailRow label="Purpose / programme" value={app.purpose} />
            </dl>
          </section>

          {app.notes && (
            <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 px-4">
              <h3 className="border-b border-slate-800 py-3 text-sm font-semibold text-white">
                Additional details
              </h3>
              <dl>
                <DetailRow label="Notes" value={app.notes} />
              </dl>
            </section>
          )}

          <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 px-4">
            <h3 className="border-b border-slate-800 py-3 text-sm font-semibold text-white">Payment</h3>
            <dl>
              <DetailRow
                label="Status"
                value={
                  <span
                    className={
                      paid
                        ? "font-semibold text-green-400"
                        : app.payment_status === "pending"
                          ? "font-semibold text-orange-400"
                          : "font-semibold text-red-400"
                    }
                  >
                    {app.payment_status}
                  </span>
                }
              />
              <DetailRow label="Reference" value={app.payment_reference || "—"} />
              {app.payment_amount != null && (
                <DetailRow label="Amount" value={formatPrice(app.payment_amount)} />
              )}
              {app.payment_type && <DetailRow label="Type" value={app.payment_type} />}
              {app.payment_provider && <DetailRow label="Provider" value={app.payment_provider} />}
            </dl>
          </section>

          <section className="mt-4 rounded-xl border border-slate-800 bg-slate-950/50 px-4 pb-2">
            <h3 className="border-b border-slate-800 py-3 text-sm font-semibold text-white">
              Uploaded files ({app.uploaded_files?.length ?? 0})
            </h3>
            {app.uploaded_files?.length ? (
              <ul className="space-y-2 py-3">
                {app.uploaded_files.map((file, i) => (
                  <li key={`${file.url}-${i}`}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gold-400 hover:underline"
                    >
                      {file.name}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                    {file.size > 0 && (
                      <span className="ml-2 text-xs text-slate-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-sm text-slate-500">No files uploaded.</p>
            )}
          </section>

          <p className="py-4 text-xs text-slate-600">
            Application ID: <span className="font-mono text-slate-500">{app.id}</span>
          </p>
        </div>

        <div className="flex justify-end border-t border-slate-800 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
