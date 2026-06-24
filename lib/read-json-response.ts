/** Safari throws "The string did not match the expected pattern" on res.json() for empty/non-JSON bodies. */
export function friendlyHttpError(status: number): string {
  if (status === 413) {
    return "Files are too large. Use smaller photos (under 4 MB total) and try again.";
  }
  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }
  if (status >= 500) {
    return "Server error. Please try again or contact us on WhatsApp.";
  }
  return "Could not complete the request. Please try again or contact us on WhatsApp.";
}

export async function readJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    if (!res.ok) throw new Error(friendlyHttpError(res.status));
    return {} as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(friendlyHttpError(res.status));
  }
}
