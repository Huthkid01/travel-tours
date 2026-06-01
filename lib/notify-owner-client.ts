"use client";

import {
  sendApplicationViaFormSubmitClient,
  sendContactViaFormSubmitClient,
  sendLeadViaFormSubmitClient,
} from "@/lib/formsubmit-client";
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
      message:
        json.error ||
        "Backup email failed. Add GMAIL_APP_PASSWORD in Vercel, or activate FormSubmit on the live site.",
    };
  } catch {
    return { ok: false, message: "Could not reach the server for backup email." };
  }
}

/** FormSubmit from the browser, then Gmail via API if that fails */
export async function notifyApplicationOwner(
  app: Application,
  options?: { stage?: "submitted" | "paid"; paymentAmount?: number }
): Promise<NotifyOwnerResult> {
  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");
  const fs = await sendApplicationViaFormSubmitClient(app, {
    stage,
    paymentAmount: options?.paymentAmount,
  });
  if (fs.ok) return { ok: true, method: "formsubmit" };

  const backup = await tryGmailBackup({
    type: "application",
    applicationId: app.id,
    stage,
    paymentAmount: options?.paymentAmount,
  });
  if (backup.ok) return backup;

  return { ok: false, message: fs.message ?? backup.message };
}

export async function notifyContactOwner(data: ContactFormData): Promise<NotifyOwnerResult> {
  const fs = await sendContactViaFormSubmitClient(data);
  if (fs.ok) return { ok: true, method: "formsubmit" };

  const backup = await tryGmailBackup({ type: "contact", data });
  if (backup.ok) return backup;

  return { ok: false, message: fs.message ?? backup.message };
}

export async function notifyLeadOwner(data: {
  name: string;
  phone: string;
  email: string;
  interest: string;
}): Promise<NotifyOwnerResult> {
  const fs = await sendLeadViaFormSubmitClient(data);
  if (fs.ok) return { ok: true, method: "formsubmit" };

  const backup = await tryGmailBackup({ type: "lead", data });
  if (backup.ok) return backup;

  return { ok: false, message: fs.message ?? backup.message };
}
