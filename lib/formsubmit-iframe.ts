"use client";

import { SITE_CONFIG } from "@/lib/constants";

type FormSubmitResult = { ok: boolean; message?: string };

function getFormSubmitRecipient(): string {
  return (
    process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim() ||
    SITE_CONFIG.email
  );
}

/** Standard form POST in a hidden iframe — avoids fetch/CORS to formsubmit.co/ajax */
export function postFormSubmitViaHiddenForm(
  formData: FormData,
  timeoutMs = 10_000
): Promise<FormSubmitResult> {
  if (typeof document === "undefined") {
    return Promise.resolve({ ok: false, message: "Not in browser" });
  }

  const email = getFormSubmitRecipient();
  const iframeName = `formsubmit_${Date.now()}`;
  const donePath = "/formsubmit-ok";

  if (!formData.has("_captcha")) formData.append("_captcha", "false");
  if (!formData.has("_url")) formData.append("_url", window.location.href);
  formData.set("_next", `${window.location.origin}${donePath}`);

  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.title = "FormSubmit";
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText =
      "position:absolute;width:0;height:0;border:0;opacity:0;pointer-events:none";

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `https://formsubmit.co/${encodeURIComponent(email)}`;
    form.target = iframeName;
    form.style.display = "none";

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    }

    let settled = false;
    const finish = (result: FormSubmitResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      iframe.remove();
      form.remove();
      resolve(result);
    };

    iframe.addEventListener("load", () => {
      try {
        const href = iframe.contentWindow?.location?.href ?? "";
        if (href.includes(donePath)) {
          finish({ ok: true });
        }
      } catch {
        /* cross-origin until FormSubmit redirects to our /formsubmit-ok */
      }
    });

    const timer = window.setTimeout(() => {
      finish({
        ok: true,
        message: "Form submitted (confirmation may be delayed).",
      });
    }, timeoutMs);

    document.body.append(iframe, form);
    form.submit();
  });
}
