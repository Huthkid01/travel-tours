import "server-only";

import { getFormSubmitEmail, getSiteUrl } from "@/lib/env.server";

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax";

function getFormSubmitAccessKey(): string | undefined {
  return process.env.FORMSUBMIT_ACCESS_KEY?.trim() || undefined;
}

/** Low-level FormSubmit POST — often 403 from Vercel; prefer Gmail via owner-email.ts */
export async function postFormSubmitServer(formData: FormData): Promise<void> {
  const email = encodeURIComponent(getFormSubmitEmail());
  const accessKey = getFormSubmitAccessKey();
  const endpoint = accessKey
    ? `${FORMSUBMIT_ENDPOINT}/${email}/${encodeURIComponent(accessKey)}`
    : `${FORMSUBMIT_ENDPOINT}/${email}`;

  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      Referer: getSiteUrl(),
      Origin: getSiteUrl(),
      "User-Agent": "Mozilla/5.0 (compatible; DarboiConsults/1.0)",
    },
  });

  const json = (await res.json().catch(() => ({}))) as {
    success?: string | boolean;
    message?: string;
  };

  const message = (json.message || "").toLowerCase();
  const ok =
    res.ok &&
    (json.success === "true" ||
      json.success === true ||
      message.includes("thank") ||
      (res.status === 200 && !message.includes("fail") && !message.includes("error")));

  if (!ok) {
    const msg = json.message || `FormSubmit request failed (${res.status})`;
    if (res.status === 403) {
      throw new Error(
        "FormSubmit blocked server requests (403). Set GMAIL_APP_PASSWORD in Vercel and redeploy."
      );
    }
    if (/activat/i.test(msg)) {
      throw new Error(
        "FormSubmit not activated. Submit the Contact form once in Chrome, then check darboiconsults@gmail.com for the activation link."
      );
    }
    throw new Error(msg);
  }
}
