import { createApplication } from "@/services/applications";
import { uploadApplicationFiles } from "@/services/storage";
import { notifyOwnerOnApplicationSubmit } from "@/lib/notify-owner";
import type { Application, ApplicationFormData } from "@/types";

/** Save application, upload files, email owner immediately */
export async function submitApplicationWithNotify(
  storageSlug: string,
  serviceName: string,
  form: ApplicationFormData,
  files: File[],
  applicationId: string = crypto.randomUUID()
): Promise<{ application: Application; emailSent: boolean }> {
  const uploaded = await uploadApplicationFiles(storageSlug, applicationId, files);
  const application = await createApplication(serviceName, form, uploaded, applicationId);
  const emailSent = await notifyOwnerOnApplicationSubmit(application, files);
  return { application, emailSent };
}
