/** Set NEXT_PUBLIC_SHOW_PRICING=true to display prices publicly */
export const SHOW_PRICING =
  process.env.NEXT_PUBLIC_SHOW_PRICING === "true" ||
  process.env.NEXT_PUBLIC_SHOW_PRICES === "true";

/** @deprecated Use SHOW_PRICING */
export const SHOW_PUBLIC_PRICES = SHOW_PRICING;
