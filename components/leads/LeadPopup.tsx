"use client";

import { submitLead } from "@/services/leads";
import { trackEvent } from "@/lib/analytics";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
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

const DISMISS_KEY = "daboi_lead_popup_dismissed";

export function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<LeadForm>({
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
  };

  const onSubmit = async (data: LeadForm) => {
    const result = await submitLead(data);
    if (result.ok) {
      trackEvent({ eventType: "lead_capture", element: "lead_popup", metadata: { interest: data.interest } });
      setSubmitted(true);
      reset();
      toast.success("Thank you! We'll be in touch soon.");
      setTimeout(dismiss, 2000);
    } else {
      toast.error(result.error ?? "Could not save. Please try WhatsApp.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={dismiss} aria-label="Close" />
      <div className="relative w-full max-w-md rounded-2xl border border-gold-500/30 bg-white p-6 shadow-2xl dark:bg-navy-900">
        <button type="button" onClick={dismiss} className="absolute top-4 right-4 text-navy-400 hover:text-navy-900" aria-label="Close">
          <X className="h-5 w-5" />
        </button>
        {submitted ? (
          <p className="py-8 text-center text-lg font-medium text-navy-900 dark:text-white">Thank you for your interest!</p>
        ) : (
          <>
            <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">Stay Connected</h3>
            <p className="mt-2 text-sm text-navy-600 dark:text-navy-400">
              Share your details and we&apos;ll reach out about our services and programs.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
              <input {...register("name")} placeholder="Full name" className="w-full rounded-xl border px-4 py-2.5 dark:bg-navy-800" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              <input {...register("phone")} placeholder="Phone" className="w-full rounded-xl border px-4 py-2.5 dark:bg-navy-800" />
              <input {...register("email")} type="email" placeholder="Email" className="w-full rounded-xl border px-4 py-2.5 dark:bg-navy-800" />
              <input {...register("interest")} placeholder="I'm interested in..." className="w-full rounded-xl border px-4 py-2.5 dark:bg-navy-800" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gold-500 py-3 font-semibold text-navy-950 hover:bg-gold-400 disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Get Updates"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
