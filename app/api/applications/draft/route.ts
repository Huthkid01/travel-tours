import { upsertApplicationServer } from "@/services/applications.server";
import type { ApplicationFormData } from "@/types";
import { NextResponse } from "next/server";

/** Save form progress without files (called as user completes each step) */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      storageSlug: string;
      serviceName: string;
      form: ApplicationFormData;
      applicationId: string;
    };

    if (!body.applicationId || !body.serviceName || !body.form?.fullName) {
      return NextResponse.json({ error: "Invalid draft payload" }, { status: 400 });
    }

    const application = await upsertApplicationServer(
      body.serviceName,
      body.form,
      body.applicationId
    );

    return NextResponse.json({ application });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Draft save failed" },
      { status: 500 }
    );
  }
}
