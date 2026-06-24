"use client";

import { readJsonResponse } from "@/lib/read-json-response";
import type { Application, ApplicationFormData } from "@/types";

const draftIdKey = (storageSlug: string) => `app_draft_id_${storageSlug}`;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function getOrCreateApplicationId(storageSlug: string): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  const key = draftIdKey(storageSlug);
  let id = sessionStorage.getItem(key);
  if (!id || !UUID_RE.test(id)) {
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
  const hasData =
    form.fullName?.trim() ||
    form.email?.trim() ||
    form.phone?.trim() ||
    form.address?.trim() ||
    form.country?.trim() ||
    form.purpose?.trim();

  if (!hasData) return;

  const res = await fetch("/api/applications/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ storageSlug, serviceName, form, applicationId }),
  });

  if (!res.ok) {
    const json = await readJsonResponse<{ error?: string }>(res);
    throw new Error(json.error || "Could not save draft");
  }
}
