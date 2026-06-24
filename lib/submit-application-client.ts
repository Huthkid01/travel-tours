import { readJsonResponse } from "@/lib/read-json-response";
import type { Application, ApplicationFormData } from "@/types";

/** Submit application via API (avoids server-action file upload limits) */
export async function submitApplicationViaApi(
  storageSlug: string,
  serviceName: string,
  form: ApplicationFormData,
  files: File[],
  applicationId: string = crypto.randomUUID(),
  options?: { skipOwnerEmail?: boolean }
): Promise<{ application: Application; emailSent: boolean; actionToken: string }> {
  const body = new FormData();
  body.append(
    "payload",
    JSON.stringify({
      storageSlug,
      serviceName,
      form,
      applicationId,
      skipOwnerEmail: options?.skipOwnerEmail ?? true,
    })
  );
  files.forEach((file, i) => {
    body.append(`file_${i}`, file);
  });

  const res = await fetch("/api/applications/submit", {
    method: "POST",
    body,
  });

  const json = await readJsonResponse<{
    application?: Application;
    emailSent?: boolean;
    actionToken?: string;
    error?: string;
  }>(res);

  if (!res.ok || !json.application || !json.actionToken) {
    throw new Error(json.error || "Could not save your application. Please try again.");
  }

  return {
    application: json.application,
    emailSent: json.emailSent ?? false,
    actionToken: json.actionToken,
  };
}
