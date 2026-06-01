"use client";

import { ProgramCard } from "@/components/programs/ProgramCard";
import { useLiveCms } from "@/hooks/use-live-cms";
import { cn } from "@/lib/utils";
import type { Program } from "@/types";

type LiveProgramsGridProps = {
  initialPrograms?: Program[];
  variant?: "compact" | "full";
  className?: string;
  /** Poll for CMS updates (off on home to avoid image flicker while scrolling) */
  liveUpdates?: boolean;
};

export function LiveProgramsGrid({
  initialPrograms = [],
  variant = "compact",
  className,
  liveUpdates = false,
}: LiveProgramsGridProps) {
  const { data: programs } = useLiveCms<Program[]>("/api/programs", {
    initial: initialPrograms,
    enabled: liveUpdates,
  });
  const list = programs ?? initialPrograms;

  if (list.length === 0) return null;

  /** `contents` lets each ProgramCard participate in the parent grid (2×2 on mobile) */
  return (
    <div className={cn("contents", className)}>
      {list.map((program, i) => (
        <ProgramCard
          key={program.id}
          program={program}
          index={i}
          variant={variant}
          imagePriority={i < 4}
        />
      ))}
    </div>
  );
}
