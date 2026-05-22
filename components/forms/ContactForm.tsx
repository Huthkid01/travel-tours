"use client";

import { FormStepFlow } from "@/components/forms/FormStepFlow";
import { formInputClass } from "@/components/forms/form-step-styles";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { sendContactViaFormSubmitClient } from "@/lib/formsubmit-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle, Mail, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const STEPS = [
  { id: "details", title: "Your details", description: "Name and contact information", icon: User },
  { id: "message", title: "Your message", description: "What would you like to discuss?", icon: MessageSquare },
  { id: "review", title: "Send", description: "Review and submit your message", icon: Mail },
];

export function ContactForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("loading");
    try {
      const clientResult = await sendContactViaFormSubmitClient(data);
      if (!clientResult.ok) {
        throw new Error(
          clientResult.message ||
            "FormSubmit could not send. Check darboiconsults@gmail.com for the activation email (first time only)."
        );
      }

      const apiRes = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const apiJson = (await apiRes.json()) as { ok?: boolean; error?: string };

      if (!apiRes.ok || !apiJson.ok) {
        throw new Error(apiJson.error || "Could not save your message");
      }

      setStatus("success");
      toast.success("Message sent successfully!");
      toast.info("A copy was sent to Darboi Consults by email.");
      reset();
      setStep(0);
    } catch (err) {
      setStatus("idle");
      toast.error(err instanceof Error ? err.message : "Failed to send message. Please try WhatsApp.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-white p-12 text-center shadow-xl dark:bg-navy-900"
      >
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white">Message Sent!</h3>
        <p className="mt-3 text-navy-600 dark:text-navy-400">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm text-gold-600 hover:underline">
          Send another message
        </button>
      </motion.div>
    );
  }

  const handleContinue = async () => {
    if (step === 0) {
      const ok = await trigger(["name", "phone", "email"]);
      if (!ok) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      const ok = await trigger(["subject", "message"]);
      if (!ok) return;
      setStep(2);
      return;
    }
    void handleSubmit(onSubmit)();
  };

  const values = getValues();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="min-w-0">
      <FormStepFlow
        flowTitle="Contact"
        flowSubtitle="Get in touch with Darboi Consults"
        steps={STEPS}
        currentStep={step}
        onBack={() => setStep((s) => Math.max(0, s - 1))}
        onContinue={handleContinue}
        continueLabel={step === 2 ? "Send message" : undefined}
        isLastStep={step === 2}
        isSubmitting={status === "loading"}
        showBack={step > 0}
      >
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Name *</label>
              <input {...register("name")} className={formInputClass} placeholder="Your name" />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Phone *</label>
              <input {...register("phone")} className={formInputClass} placeholder="+234..." />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium">Email *</label>
              <input {...register("email")} type="email" className={formInputClass} placeholder="your@email.com" />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Subject *</label>
              <input {...register("subject")} className={formInputClass} placeholder="How can we help?" />
              {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Message *</label>
              <textarea {...register("message")} rows={5} className={formInputClass} placeholder="Your message..." />
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 rounded-xl border border-navy-100 bg-navy-50/50 p-4 text-sm dark:border-navy-700 dark:bg-navy-950/50">
            <p><span className="font-semibold text-navy-700 dark:text-navy-200">Name:</span> {values.name || "—"}</p>
            <p><span className="font-semibold text-navy-700 dark:text-navy-200">Phone:</span> {values.phone || "—"}</p>
            <p><span className="font-semibold text-navy-700 dark:text-navy-200">Email:</span> {values.email || "—"}</p>
            <p><span className="font-semibold text-navy-700 dark:text-navy-200">Subject:</span> {values.subject || "—"}</p>
            <p className="whitespace-pre-wrap"><span className="font-semibold text-navy-700 dark:text-navy-200">Message:</span> {values.message || "—"}</p>
          </div>
        )}
      </FormStepFlow>
    </form>
  );
}
