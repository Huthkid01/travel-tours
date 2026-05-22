import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { getFormSubmitEmail } from "@/lib/env.server";
import { getOwnerEmailSetupHint } from "@/services/owner-email";
import { isGmailSmtpConfigured, sendOwnerMailViaGmail } from "@/services/owner-mail-fallback";
import { NextResponse } from "next/server";

/** Admin: test Gmail delivery (server). Use browser test on admin page for FormSubmit activation. */
export async function POST() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;

  const to = getFormSubmitEmail();

  if (!isGmailSmtpConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        to,
        error:
          "GMAIL_APP_PASSWORD is not set on the server. Add it in Vercel → Environment Variables, then redeploy.",
        hint: getOwnerEmailSetupHint(),
        tryBrowser: true,
      },
      { status: 400 }
    );
  }

  try {
    await sendOwnerMailViaGmail({
      subject: "Darboi — Admin email test (Gmail)",
      replyTo: to,
      fields: {
        name: "Darboi Admin Test",
        email: to,
        message: `Test at ${new Date().toISOString()}. If you see this, Gmail SMTP is working on Vercel.`,
      },
    });
    return NextResponse.json({
      ok: true,
      to,
      method: "gmail",
      hint: "Check darboiconsults@gmail.com inbox (and spam).",
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        to,
        error: err instanceof Error ? err.message : "Gmail send failed",
        hint: "Check GMAIL_APP_PASSWORD is a valid Google App Password (16 chars, no extra spaces).",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;

  return NextResponse.json({
    to: getFormSubmitEmail(),
    gmailConfigured: isGmailSmtpConfigured(),
    hint: getOwnerEmailSetupHint(),
  });
}
