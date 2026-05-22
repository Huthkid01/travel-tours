"use client";

import { appConfirm, type ConfirmOptions } from "@/lib/confirm";

/** Promise-based confirm dialog (replaces window.confirm) */
export function useConfirm() {
  return appConfirm;
}

export type { ConfirmOptions };
