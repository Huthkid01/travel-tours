export type ConfirmVariant = "default" | "danger";

export interface ConfirmOptions {
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  /** Single OK button (replaces window.alert) */
  alertOnly?: boolean;
}

type ConfirmHandler = (options: ConfirmOptions) => Promise<boolean>;

const handlers: ConfirmHandler[] = [];

export function registerConfirmHandler(next: ConfirmHandler | null): () => void {
  if (!next) return () => {};
  handlers.push(next);
  return () => {
    const index = handlers.lastIndexOf(next);
    if (index >= 0) handlers.splice(index, 1);
  };
}

/** App-wide confirm — never uses the browser dialog */
export async function appConfirm(options: ConfirmOptions): Promise<boolean> {
  const handler = handlers[handlers.length - 1];
  if (!handler) {
    console.warn("[confirm] ConfirmProvider not mounted");
    return false;
  }
  return handler(options);
}
