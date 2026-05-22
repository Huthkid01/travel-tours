import { cn } from "@/lib/utils";

export const formInputClass = cn(
  "box-border w-full max-w-full min-w-0 rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 outline-none transition",
  "focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20",
  "dark:border-navy-700 dark:bg-navy-900 dark:text-white"
);

export const formLabelClass =
  "mb-1 block text-sm font-semibold uppercase tracking-wide text-navy-800 dark:text-navy-200";
