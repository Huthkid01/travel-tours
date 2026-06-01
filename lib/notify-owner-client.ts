"use client";

import {
  sendApplicationViaFormSubmitBrowser,
  sendContactViaFormSubmitBrowser,
  sendLeadViaFormSubmitBrowser,
} from "@/lib/formsubmit-browser";
import type { Application, ContactFormData } from "@/types";

type NotifyMethod = "formsubmit" | "gmail";

export type NotifyOwnerResult = {
  ok: boolean;
  method?: NotifyMethod;
  message?: string;
};

async function tryGmailBackup(body: Record<string, unknown>): Promise<NotifyOwnerResult> {
  try {
    const res = await fetch("/api/owner-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as {
      ok?: boolean;
      method?: NotifyMethod;
      error?: string;
    };
    if (res.ok && json.ok) {
      return { ok: true, method: json.method ?? "gmail" };
    }
    return {
      ok: false,
      message: json.error || "Gmail backup is not configured (GMAIL_APP_PASSWORD in Vercel).",
    };
  } catch {
    return { ok: false, message: "Could not reach the server for backup email." };
  }
}

/** Browser FormSubmit (real POST to formsubmit.co), optional Gmail backup */
export async function notifyApplicationOwner(
  app: Application,
  options?: { stage?: "submitted" | "paid"; paymentAmount?: number }
): Promise<NotifyOwnerResult> {
  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");

  const fs = await sendApplicationViaFormSubmitBrowser(app, {
    stage,
    paymentAmount: options?.paymentAmount,
  });
  if (fs.ok) return { ok: true, method: "formsubmit" };

  const gmail = await tryGmailBackup({
    type: "application",
    applicationId: app.id,
    stage,
    paymentAmount: options?.paymentAmount,
  });
  if (gmail.ok) return gmail;

  return { ok: false, message: fs.message ?? gmail.message };
}

export async function notifyContactOwner(data: ContactFormData): Promise<NotifyOwnerResult> {
  const fs = await sendContactViaFormSubmitBrowser(data);
  if (fs.ok) return { ok: true, method: "formsubmit" };

  const gmail = await tryGmailBackup({ type: "contact", data });
  if (gmail.ok) return gmail;

  return { ok: false, message: fs.message ?? gmail.message };
}

export async function notifyLeadOwner(data: {
  name: string;
  phone: string;
  email: string;
  interest: string;
}): Promise<NotifyOwnerResult> {
  const fs = await sendLeadViaFormSubmitBrowser(data);
  if (fs.ok) return { ok: true, method: "formsubmit" };

  const gmail = await tryGmailBackup({ type: "lead", data });
  if (gmail.ok) return gmail;

  return { ok: false, message: fs.message ?? gmail.message };
}
