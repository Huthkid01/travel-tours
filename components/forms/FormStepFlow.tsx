"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface FormStepConfig {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

interface FormStepFlowProps {
  flowTitle: string;
  flowSubtitle?: string;
  steps: FormStepConfig[];
  currentStep: number;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  showBack?: boolean;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

export function FormStepFlow({
  flowTitle,
  flowSubtitle,
  steps,
  currentStep,
  onBack,
  onContinue,
  continueLabel,
  showBack = true,
  isSubmitting = false,
  isLastStep = false,
  children,
  footer,
}: FormStepFlowProps) {
  const step = steps[currentStep];
  const StepIcon = step?.icon;

  return (
    <div className="min-w-0 space-y-6">
      <div className="text-center sm:text-left">
        <p className="text-xs font-bold tracking-[0.2em] text-gold-600 uppercase">{flowTitle}</p>
        {flowSubtitle && (
          <p className="mt-1 text-sm text-navy-600 dark:text-navy-400">{flowSubtitle}</p>
        )}
      </div>

      <nav aria-label="Form progress" className="px-1">
        <ol className="flex items-center justify-between gap-1">
          {steps.map((s, index) => {
            const done = index < currentStep;
            const active = index === currentStep;
            return (
              <li key={s.id} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition",
                      active && "bg-navy-900 text-white ring-4 ring-gold-500/25 dark:bg-white dark:text-navy-900",
                      done && "bg-gold-500 text-navy-950",
                      !active && !done && "border-2 border-navy-200 bg-white text-navy-400 dark:border-navy-600 dark:bg-navy-900"
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
                    {s.title}
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
        <p className="mt-3 text-center text-xs text-navy-500 sm:hidden">
          Step {currentStep + 1} of {steps.length}: {step?.title}
        </p>
      </nav>

      <section className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-sm dark:border-navy-800 dark:bg-navy-900">
        <div className="border-b border-navy-100 bg-navy-50/80 px-4 py-4 sm:px-6 dark:border-navy-800 dark:bg-navy-950/50">
          <div className="flex items-start gap-3">
            {StepIcon && (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
                <StepIcon className="h-5 w-5" />
              </span>
            )}
            <div>
              <h2 className="font-display text-lg font-bold text-navy-900 dark:text-white">{step?.title}</h2>
              {step?.description && (
                <p className="mt-0.5 text-sm text-navy-600 dark:text-navy-400">{step.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0 px-4 py-6 sm:px-6">{children}</div>

        <div className="flex flex-col-reverse gap-3 border-t border-navy-100 bg-navy-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-navy-800 dark:bg-navy-950/30">
          {showBack && currentStep > 0 ? (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-navy-200 px-5 py-3 text-sm font-semibold text-navy-700 transition hover:bg-white disabled:opacity-50 dark:border-navy-600 dark:text-navy-200 dark:hover:bg-navy-800"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          <button
            type="button"
            onClick={onContinue}
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-bold text-navy-950 shadow-md shadow-gold-600/20 transition hover:bg-gold-600 disabled:opacity-60 sm:ml-auto sm:w-auto"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {continueLabel ?? (isLastStep ? "Submit application" : "Continue")}
                {!isLastStep && <ChevronRight className="h-4 w-4" />}
              </>
            )}
          </button>
        </div>
      </section>

      {footer}
    </div>
  );
}
