"use client";

import {
  registerConfirmHandler,
  type ConfirmOptions,
  type ConfirmVariant,
} from "@/lib/confirm";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

type PendingConfirm = ConfirmOptions & {
  resolve: (value: boolean) => void;
};

const confirmBtn: Record<ConfirmVariant, string> = {
  default:
    "bg-gold-500 text-navy-950 hover:bg-gold-400 dark:bg-gold-500 dark:text-navy-950",
  danger: "bg-red-600 text-white hover:bg-red-500",
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const close = useCallback((value: boolean) => {
    setPending((current) => {
      current?.resolve(value);
      return null;
    });
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  useEffect(() => {
    registerConfirmHandler(confirm);
    return () => registerConfirmHandler(null);
  }, [confirm]);

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pending, close]);

  const variant = pending?.variant ?? "default";

  return (
    <>
      {children}
      {pending && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            aria-label="Close dialog"
            onClick={() => close(false)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="app-confirm-title"
            aria-describedby="app-confirm-desc"
            className="relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <h2
              id="app-confirm-title"
              className="font-display text-lg font-bold text-slate-900 dark:text-white"
            >
              {pending.title ?? "Confirm"}
            </h2>
            <p
              id="app-confirm-desc"
              className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            >
              {pending.description}
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {pending.cancelLabel ?? "Cancel"}
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  confirmBtn[variant]
                )}
              >
                {pending.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
