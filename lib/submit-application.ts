import { submitApplicationAction } from "@/lib/actions/application";
import type { Application, ApplicationFormData } from "@/types";

/** Save application, upload files, email owner immediately (server-side) */
export async function submitApplicationWithNotify(
  storageSlug: string,
  serviceName: string,
  form: ApplicationFormData,
  files: File[],
  applicationId: string = crypto.randomUUID()
): Promise<{ application: Application; emailSent: boolean }> {
  const result = await submitApplicationAction(storageSlug, serviceName, form, files, applicationId);
  if (result.error) throw new Error(result.error);
  return { application: result.application, emailSent: result.emailSent };
}
