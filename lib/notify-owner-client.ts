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
        "Gmail is not configured on the server. Set GMAIL_APP_PASSWORD in Vercel and redeploy.",
    };
  } catch {
    return { ok: false, message: "Could not reach the server for backup email." };
  }
}

const GMAIL_SETUP_HINT =
  "Add GMAIL_APP_PASSWORD in Vercel (Google App Password for darboiconsults@gmail.com), then redeploy.";

/** Gmail via your API first (no CORS), then FormSubmit in the browser */
export async function notifyApplicationOwner(
  app: Application,
  options?: { stage?: "submitted" | "paid"; paymentAmount?: number }
): Promise<NotifyOwnerResult> {
  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");

  const gmail = await tryGmailBackup({
    type: "application",
    applicationId: app.id,
    stage,
    paymentAmount: options?.paymentAmount,
  });
  if (gmail.ok) return gmail;

  const fs = await sendApplicationViaFormSubmitClient(app, {
    stage,
    paymentAmount: options?.paymentAmount,
  });
  if (fs.ok) return { ok: true, method: "formsubmit" };

  return {
    ok: false,
    message: gmail.message?.includes("GMAIL") ? gmail.message : `${fs.message ?? gmail.message} ${GMAIL_SETUP_HINT}`,
  };
}

export async function notifyContactOwner(data: ContactFormData): Promise<NotifyOwnerResult> {
  const gmail = await tryGmailBackup({ type: "contact", data });
  if (gmail.ok) return gmail;

  const fs = await sendContactViaFormSubmitClient(data);
  if (fs.ok) return { ok: true, method: "formsubmit" };

  return { ok: false, message: fs.message ?? `${gmail.message} ${GMAIL_SETUP_HINT}` };
}

export async function notifyLeadOwner(data: {
  name: string;
  phone: string;
  email: string;
  interest: string;
}): Promise<NotifyOwnerResult> {
  const gmail = await tryGmailBackup({ type: "lead", data });
  if (gmail.ok) return gmail;

  const fs = await sendLeadViaFormSubmitClient(data);
  if (fs.ok) return { ok: true, method: "formsubmit" };

  return { ok: false, message: fs.message ?? `${gmail.message} ${GMAIL_SETUP_HINT}` };
}
