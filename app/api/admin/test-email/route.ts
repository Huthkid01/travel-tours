import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { getFormSubmitEmail } from "@/lib/env.server";
import { isGmailSmtpConfigured } from "@/services/owner-mail-fallback";
import { sendContactForm } from "@/services/formsubmit";
import { NextResponse } from "next/server";

/** Admin-only: verify owner email delivery (FormSubmit or Gmail fallback) */
export async function POST() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;

  const to = getFormSubmitEmail();
  try {
    await sendContactForm({
      name: "Darboi Admin Test",
      email: to,
      phone: "—",
      subject: "Email test from admin dashboard",
      message: `Test sent at ${new Date().toISOString()}. If you received this, owner notifications are working.`,
    });
    return NextResponse.json({
      ok: true,
      to,
      gmailFallbackAvailable: isGmailSmtpConfigured(),
      hint: "Check inbox and spam. If missing, activate FormSubmit (confirmation link) or set GMAIL_APP_PASSWORD in Vercel.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        to,
        error: err instanceof Error ? err.message : "Test email failed",
        gmailFallbackAvailable: isGmailSmtpConfigured(),
      },
      { status: 500 }
    );
  }
}
