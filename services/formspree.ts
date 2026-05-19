import { FORMSPREE } from "@/lib/constants";

export interface FormspreeResponse {
  ok: boolean;
  error?: string;
}

export async function submitToFormspree(
  formId: string,
  data: Record<string, string | number>
): Promise<FormspreeResponse> {
  const isDemo = formId.startsWith("demo_") || formId === "your_reservation_form_id" || formId === "your_contact_form_id";

  if (isDemo) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { ok: true };
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return { ok: true };
    }

    const errorData = await response.json().catch(() => ({}));
    return {
      ok: false,
      error: (errorData as { error?: string }).error || "Submission failed",
    };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function submitReservation(
  data: Record<string, string | number>
): Promise<FormspreeResponse> {
  return submitToFormspree(FORMSPREE.reservation, {
    _subject: "New Travel Reservation",
    ...data,
  });
}

export async function submitContact(
  data: Record<string, string>
): Promise<FormspreeResponse> {
  return submitToFormspree(FORMSPREE.contact, {
    _subject: "New Contact Message",
    ...data,
  });
}
