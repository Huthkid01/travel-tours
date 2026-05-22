"use client";

import { ProgramCard } from "@/components/programs/ProgramCard";
import { useLiveCms } from "@/hooks/use-live-cms";
import { cn } from "@/lib/utils";
import type { Program } from "@/types";

type LiveProgramsGridProps = {
  initialPrograms?: Program[];
  variant?: "compact" | "full";
  className?: string;
};

export function LiveProgramsGrid({
  initialPrograms = [],
  variant = "compact",
  className,
}: LiveProgramsGridProps) {
  const { data: programs } = useLiveCms<Program[]>("/api/programs", {
    initial: initialPrograms,
  });
  const list = programs ?? initialPrograms;

  if (list.length === 0) return null;

  /** `contents` lets each ProgramCard participate in the parent grid (2×2 on mobile) */
  return (
    <div className={cn("contents", className)}>
      {list.map((program, i) => (
        <ProgramCard key={program.id} program={program} index={i} variant={variant} />
      ))}
    </div>
  );
}
