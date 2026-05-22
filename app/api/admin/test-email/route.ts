import { isAdminResponse, requireAdminSession } from "@/lib/admin-api";
import { getFormSubmitEmail } from "@/lib/env.server";
import { NextResponse } from "next/server";

/** FormSubmit must run in the browser — use Admin → Test owner email button (client-side). */
export async function POST() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;

  return NextResponse.json(
    {
      ok: false,
      to: getFormSubmitEmail(),
      useBrowser: true,
      error: "FormSubmit cannot send from the server. The admin page will send from your browser instead.",
      hint: "Submit the Contact form on the live site once to receive FormSubmit’s activation email.",
    },
    { status: 400 }
  );
}

export async function GET() {
  const session = await requireAdminSession();
  if (isAdminResponse(session)) return session;

  return NextResponse.json({
    to: getFormSubmitEmail(),
    formsubmitUrl: `https://formsubmit.co/ajax/${encodeURIComponent(getFormSubmitEmail())}`,
    hint: "Emails use FormSubmit from the visitor’s browser. Activate once via Contact form on the live site.",
  });
}
