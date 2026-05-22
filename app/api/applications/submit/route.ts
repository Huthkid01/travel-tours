import { notifyOwnerOnApplicationSubmit } from "@/lib/notify-owner";
import { createApplicationServer } from "@/services/applications.server";
import { uploadApplicationFilesServer } from "@/services/storage.server";
import type { ApplicationFormData } from "@/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const payloadRaw = formData.get("payload");
    if (!payloadRaw || typeof payloadRaw !== "string") {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    const payload = JSON.parse(payloadRaw) as {
      storageSlug: string;
      serviceName: string;
      form: ApplicationFormData;
      applicationId?: string;
    };

    const applicationId = payload.applicationId || crypto.randomUUID();
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file_") && value instanceof File && value.size > 0) {
        files.push(value);
      }
    }

    let uploaded: Awaited<ReturnType<typeof uploadApplicationFilesServer>> = [];
    if (files.length > 0) {
      try {
        uploaded = await uploadApplicationFilesServer(
          payload.storageSlug,
          applicationId,
          files
        );
      } catch (err) {
        console.error("[applications/submit] upload failed:", err);
      }
    }

    const application = await createApplicationServer(
      payload.serviceName,
      payload.form,
      uploaded,
      applicationId
    );

    let emailSent = false;
    try {
      emailSent = await notifyOwnerOnApplicationSubmit(application, files);
    } catch (err) {
      console.error("[applications/submit] email failed:", err);
    }

    return NextResponse.json({ application, emailSent });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Could not save your application. Please try again or contact us on WhatsApp.",
      },
      { status: 500 }
    );
  }
}
