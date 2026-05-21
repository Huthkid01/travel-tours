import { SHOW_PRICING } from "@/lib/features";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type PriceLabelVariant = "contact" | "consultation" | "request";

const LABELS: Record<PriceLabelVariant, string> = {
  contact: "Contact for Details",
  consultation: "Consultation Required",
  request: "Available on Request",
};

interface PriceLabelProps {
  amount?: number | null;
  variant?: PriceLabelVariant;
  className?: string;
  prefix?: string;
}

export function PriceLabel({
  amount,
  variant = "contact",
  className,
  prefix,
}: PriceLabelProps) {
  if (SHOW_PRICING && amount != null) {
    return (
      <span className={cn("font-semibold text-gold-600", className)}>
        {prefix}
        {formatPrice(amount)}
      </span>
    );
  }

  return (
    <span className={cn("text-sm font-medium text-gold-500/90", className)}>
      {LABELS[variant]}
    </span>
  );
}

export function PricingBlock({ className }: { className?: string }) {
  if (SHOW_PRICING) return null;
  return (
    <div className={cn("rounded-xl border border-gold-500/20 bg-gold-500/5 px-4 py-3", className)}>
      <p className="text-sm font-medium text-gold-600">Consultation Required</p>
      <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">
        Pricing is provided after consultation. Contact us for details.
      </p>
    </div>
  );
}
