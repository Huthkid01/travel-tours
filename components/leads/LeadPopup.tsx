"use client";

import { FormStepFlow } from "@/components/forms/FormStepFlow";
import { formInputClass } from "@/components/forms/form-step-styles";
import { submitLeadAction } from "@/lib/actions/leads";
import { trackEvent } from "@/lib/analytics";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  interest: z.string().min(2),
});

type LeadForm = z.infer<typeof schema>;

const STEPS = [
  { id: "contact", title: "Your details", description: "How we can reach you", icon: User },
  { id: "interest", title: "Your interest", description: "What service are you looking for?", icon: MessageSquare },
];

const DISMISS_KEY = "daboi_lead_popup_dismissed";

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = useForm<LeadForm>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 12000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setOpen(false);
    setStep(0);
  };

  const onSubmit = async (data: LeadForm) => {
    const result = await submitLeadAction(data);
    if (result.ok) {
      trackEvent({ eventType: "lead_capture", element: "lead_popup", metadata: { interest: data.interest } });
      setSubmitted(true);
      setTimeout(dismiss, 2000);
    } else {
      toast.error(result.error ?? "Could not save. Please try WhatsApp.");
    }
  };

  const handleContinue = async () => {
    if (step === 0) {
      const ok = await trigger(["name", "phone", "email"]);
      if (!ok) return;
      setStep(1);
      return;
    }
    void handleSubmit(onSubmit)();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={dismiss} aria-label="Close" />
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gold-500/30 bg-white p-4 shadow-2xl sm:p-6 dark:bg-navy-900">
        <button type="button" onClick={dismiss} className="absolute top-4 right-4 z-10 text-navy-400 hover:text-navy-900 dark:hover:text-white" aria-label="Close">
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <p className="py-12 text-center text-lg font-medium text-navy-900 dark:text-white">Thank you for your interest!</p>
        ) : (
          <>
            <h3 className="pr-8 font-display text-xl font-bold text-navy-900 dark:text-white">Stay Connected</h3>
            <p className="mt-1 text-sm text-navy-600 dark:text-navy-400">
              Share your details and we&apos;ll reach out about our services and programs.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 min-w-0">
              <FormStepFlow
                flowTitle="Quick inquiry"
                steps={STEPS}
                currentStep={step}
                onBack={() => setStep(0)}
                onContinue={handleContinue}
                continueLabel={step === 1 ? "Get updates" : undefined}
                isLastStep={step === 1}
                isSubmitting={isSubmitting}
                showBack={step > 0}
              >
                {step === 0 && (
                  <div className="space-y-3">
                    <div>
                      <input {...register("name")} placeholder="Full name *" className={formInputClass} />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                      <input {...register("phone")} placeholder="Phone *" className={formInputClass} />
                      {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <input {...register("email")} type="email" placeholder="Email *" className={formInputClass} />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div>
                    <input {...register("interest")} placeholder="I'm interested in... *" className={formInputClass} />
                    {errors.interest && <p className="mt-1 text-xs text-red-500">{errors.interest.message}</p>}
                  </div>
                )}
              </FormStepFlow>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
