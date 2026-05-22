"use client";

import { SITE_CONFIG } from "@/lib/constants";
import type { ContactFormData } from "@/types";

/**
 * FormSubmit from the visitor's browser (same service as formsubmit.co/your@email.com).
 * Use for contact form — often works when server-side AJAX from Vercel is blocked.
 */
export async function sendContactViaFormSubmitClient(
  data: ContactFormData
): Promise<{ ok: boolean; message?: string }> {
  const recipient = encodeURIComponent(SITE_CONFIG.email);
  const formData = new FormData();
  formData.append("_subject", `Contact: ${data.subject}`);
  formData.append("_captcha", "false");
  formData.append("_template", "table");
  formData.append("_replyto", data.email);
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("subject", data.subject);
  formData.append("message", data.message);

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    });

    const json = (await res.json().catch(() => ({}))) as {
      success?: string | boolean;
      message?: string;
    };

    const msg = (json.message || "").toLowerCase();
    const ok =
      res.ok &&
      (json.success === "true" ||
        json.success === true ||
        msg.includes("thank") ||
        (res.status === 200 && !msg.includes("fail") && !msg.includes("error")));

    if (!ok) {
      const raw = json.message || `FormSubmit failed (${res.status})`;
      if (/activat/i.test(raw)) {
        return {
          ok: false,
          message:
            "FormSubmit is not activated yet. Open darboiconsults@gmail.com and click the confirmation link from FormSubmit.",
        };
      }
      return { ok: false, message: raw };
    }

    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Could not reach FormSubmit",
    };
  }
}
