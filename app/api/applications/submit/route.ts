import { createApplicationActionToken } from "@/lib/application-action-token";
import { upsertApplicationServer } from "@/services/applications.server";
import { uploadApplicationFilesServer } from "@/services/storage.server";
import type { ApplicationFormData } from "@/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
      /** When true, owner email is sent after payment (step 5) instead of on submit */
      skipOwnerEmail?: boolean;
    };

    const applicationId =
      payload.applicationId && UUID_RE.test(payload.applicationId)
        ? payload.applicationId
        : crypto.randomUUID();
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
        return NextResponse.json(
          {
            error:
              err instanceof Error
                ? err.message
                : "Could not upload your documents. Please use smaller files (under 4 MB total) and try again.",
          },
          { status: 500 }
        );
      }
      if (uploaded.length === 0) {
        return NextResponse.json(
          {
            error:
              "Could not upload your documents. Please use smaller files (under 4 MB total) and try again.",
          },
          { status: 500 }
        );
      }
    }

    const application = await upsertApplicationServer(
      payload.serviceName,
      payload.form,
      applicationId,
      uploaded
    );

    const actionToken = createApplicationActionToken(applicationId);

    return NextResponse.json({ application, emailSent: false, actionToken });
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
