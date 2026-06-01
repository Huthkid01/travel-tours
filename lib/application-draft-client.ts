"use client";

import type { Application, ApplicationFormData } from "@/types";

const draftIdKey = (storageSlug: string) => `app_draft_id_${storageSlug}`;

export function getOrCreateApplicationId(storageSlug: string): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  const key = draftIdKey(storageSlug);
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function rememberApplicationId(storageSlug: string, applicationId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(draftIdKey(storageSlug), applicationId);
  sessionStorage.setItem("pending_application_id", applicationId);
}

/** Lightweight save while user fills the form (no file upload) */
export async function saveApplicationDraftViaApi(
  storageSlug: string,
  serviceName: string,
  form: ApplicationFormData,
  applicationId: string
): Promise<void> {
  if (!form.fullName?.trim() || !form.email?.trim()) return;

  const res = await fetch("/api/applications/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storageSlug, serviceName, form, applicationId }),
  });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(json.error || "Could not save draft");
  }
}
