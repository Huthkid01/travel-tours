export type ConfirmVariant = "default" | "danger";

export interface ConfirmOptions {
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

type ConfirmHandler = (options: ConfirmOptions) => Promise<boolean>;

let handler: ConfirmHandler | null = null;

export function registerConfirmHandler(next: ConfirmHandler | null): void {
  handler = next;
}

/** App-wide confirm — never uses the browser dialog */
export async function appConfirm(options: ConfirmOptions): Promise<boolean> {
  if (!handler) {
    console.warn("[confirm] ConfirmProvider not mounted");
    return false;
  }
  return handler(options);
}
