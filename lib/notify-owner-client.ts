"use client";

import type { Application, ContactFormData } from "@/types";

type NotifyMethod = "gmail";

export type NotifyOwnerResult = {
  ok: boolean;
  method?: NotifyMethod;
  message?: string;
};

async function sendViaGmailApi(body: Record<string, unknown>): Promise<NotifyOwnerResult> {
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
      return { ok: true, method: "gmail" };
    }
    return {
      ok: false,
      message:
        json.error ||
        "Email could not be sent. Set SMTP_USER, GMAIL_APP_PASSWORD, and OWNER_INBOX_EMAIL in Vercel.",
    };
  } catch {
    return { ok: false, message: "Could not reach the server to send email." };
  }
}

export async function notifyApplicationOwner(
  app: Application,
  options?: { stage?: "submitted" | "paid"; paymentAmount?: number }
): Promise<NotifyOwnerResult> {
  const stage = options?.stage ?? (app.payment_status === "paid" ? "paid" : "submitted");
  return sendViaGmailApi({
    type: "application",
    applicationId: app.id,
    stage,
    paymentAmount: options?.paymentAmount,
  });
}

export async function notifyContactOwner(data: ContactFormData): Promise<NotifyOwnerResult> {
  return sendViaGmailApi({ type: "contact", data });
}

export async function notifyLeadOwner(data: {
  name: string;
  phone: string;
  email: string;
  interest: string;
}): Promise<NotifyOwnerResult> {
  return sendViaGmailApi({ type: "lead", data });
}
