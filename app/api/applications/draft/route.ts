import { upsertApplicationServer } from "@/services/applications.server";
import type { ApplicationFormData } from "@/types";
import { NextResponse } from "next/server";

/** Fill required DB columns while the user is still typing */
function normalizeDraftForm(form: ApplicationFormData): ApplicationFormData {
  return {
    fullName: form.fullName?.trim() || "In progress",
    email: form.email?.trim() || "pending@darboi.local",
    phone: form.phone?.trim() || "00000000000",
    country: form.country?.trim() || "Pending",
    address: form.address?.trim() || "Pending",
    purpose: form.purpose?.trim() || "Pending",
    notes: form.notes,
  };
}

/** Save form progress without files (called as user completes each step) */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      storageSlug: string;
      serviceName: string;
      form: ApplicationFormData;
      applicationId: string;
    };

    if (!body.applicationId || !body.serviceName || !body.form) {
      return NextResponse.json({ error: "Invalid draft payload" }, { status: 400 });
    }

    const hasData =
      body.form.fullName?.trim() ||
      body.form.email?.trim() ||
      body.form.phone?.trim() ||
      body.form.address?.trim();

    if (!hasData) {
      return NextResponse.json({ error: "Nothing to save yet" }, { status: 400 });
    }

    const application = await upsertApplicationServer(
      body.serviceName,
      normalizeDraftForm(body.form),
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
