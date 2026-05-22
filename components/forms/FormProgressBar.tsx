"use client";

import { cn } from "@/lib/utils";

interface FormProgressBarProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

/** Standalone progress bar (e.g. payment page after application steps) */
export function FormProgressBar({ steps, currentStep, className }: FormProgressBarProps) {
  return (
    <nav aria-label="Progress" className={cn("px-1", className)}>
      <ol className="flex items-center justify-between gap-1">
        {steps.map((title, index) => {
          const done = index < currentStep;
          const active = index === currentStep;
          return (
            <li key={title} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    active && "bg-navy-900 text-white ring-4 ring-gold-500/25 dark:bg-white dark:text-navy-900",
                    done && "bg-gold-500 text-navy-950",
                    !active && !done && "border-2 border-navy-200 bg-white text-navy-400 dark:border-navy-600"
                  )}
                >
                  {done ? "✓" : index + 1}
                </span>
                <span
                  className={cn(
                    "hidden max-w-[4.5rem] text-center text-[10px] leading-tight font-medium sm:block",
                    active ? "text-navy-900 dark:text-white" : "text-navy-400"
                  )}
                >
                  {title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 flex-1 rounded-full sm:mx-2",
                    index < currentStep ? "bg-gold-500" : "bg-navy-200 dark:bg-navy-700"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
