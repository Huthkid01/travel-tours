import { resolveSubmissionUrl } from "@/lib/resolve-submission-url";
import { getApplicationServer } from "@/services/applications.server";
import { isGmailSmtpConfigured } from "@/services/owner-mail-fallback";
import {
  sendApplicationForm,
  sendContactForm,
  sendLeadForm,
  type LeadFormData,
} from "@/services/formsubmit";
import type { ContactFormData } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!isGmailSmtpConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Gmail is not configured. In Vercel add SMTP_USER (sender), GMAIL_APP_PASSWORD, and OWNER_INBOX_EMAIL (darboiconsults@gmail.com), then redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as {
      type?: string;
      applicationId?: string;
      stage?: "submitted" | "paid";
      paymentAmount?: number;
      submittedFrom?: string;
      data?: ContactFormData | LeadFormData;
    };

    const submissionUrl = resolveSubmissionUrl(request, body.submittedFrom);

    if (body.type === "application" && body.applicationId) {
      const app = await getApplicationServer(body.applicationId);
      if (!app) {
        return NextResponse.json({ ok: false, error: "Application not found" }, { status: 404 });
      }
      await sendApplicationForm(app, {
        stage: body.stage ?? "paid",
        paymentAmount: body.paymentAmount,
        submissionUrl,
      });
      return NextResponse.json({ ok: true, method: "gmail" });
    }

    if (body.type === "contact" && body.data) {
      await sendContactForm(body.data as ContactFormData, { submissionUrl });
      return NextResponse.json({ ok: true, method: "gmail" });
    }

    if (body.type === "lead" && body.data) {
      await sendLeadForm(body.data as LeadFormData, { submissionUrl });
      return NextResponse.json({ ok: true, method: "gmail" });
    }

    return NextResponse.json({ ok: false, error: "Invalid notify request" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Email failed" },
      { status: 500 }
    );
  }
}
