import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "blue",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: "blue" | "green" | "orange" | "purple";
}) {
  const accents = {
    blue: "bg-blue-500/15 text-blue-400",
    green: "bg-green-500/15 text-green-400",
    orange: "bg-orange-500/15 text-orange-400",
    purple: "bg-purple-500/15 text-purple-400",
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <div className={cn("rounded-lg p-3", accents[accent])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
