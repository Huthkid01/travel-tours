"use client";

import { Button } from "@/components/ui/Button";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { submitContact } from "@/services/formspree";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("loading");
    const result = await submitContact(data);

    if (result.ok) {
      setStatus("success");
      toast.success("Message sent successfully!");
      reset();
    } else {
      setStatus("idle");
      toast.error(result.error || "Failed to send message.");
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
        <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
          Message Sent!
        </h3>
        <p className="mt-3 text-navy-600 dark:text-navy-400">
          Thank you for reaching out. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-gold-600 hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 dark:border-navy-700 dark:bg-navy-800 dark:text-white";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl bg-white p-8 shadow-xl dark:bg-navy-900">
      <div>
        <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">Name *</label>
        <input {...register("name")} className={inputClass} placeholder="Your name" />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">Email *</label>
        <input {...register("email")} type="email" className={inputClass} placeholder="your@email.com" />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">Message *</label>
        <textarea {...register("message")} rows={5} className={inputClass} placeholder="How can we help you?" />
        {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
      </div>
      <Button type="submit" loading={status === "loading"} className="w-full">
        <Send className="h-4 w-4" />
        Send Message
      </Button>
    </form>
  );
}
