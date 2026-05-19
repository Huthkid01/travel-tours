"use client";

import { Button } from "@/components/ui/Button";
import { tours } from "@/data/tours";
import { getWhatsAppUrl, RESERVATION_WHATSAPP_MESSAGE } from "@/lib/constants";
import { reservationSchema, type ReservationFormValues } from "@/lib/validations";
import { submitReservation } from "@/services/formspree";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const travelTypes = ["Leisure", "Business", "Honeymoon", "Family", "Adventure", "Group Tour"];

interface ReservationFormProps {
  defaultDestination?: string;
}

export function ReservationForm({ defaultDestination = "" }: ReservationFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { travelers: 1, destination: defaultDestination },
  });

  const onSubmit = async (data: ReservationFormValues) => {
    setStatus("loading");
    const result = await submitReservation({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      destination: data.destination,
      departureDate: data.departureDate,
      returnDate: data.returnDate,
      travelType: data.travelType,
      travelers: data.travelers,
      notes: data.notes || "",
    });

    if (result.ok) {
      setStatus("success");
      toast.success("Reservation submitted successfully!");
      reset();
      setTimeout(() => {
        window.location.href = getWhatsAppUrl(RESERVATION_WHATSAPP_MESSAGE);
      }, 3000);
    } else {
      setStatus("idle");
      toast.error(result.error || "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl bg-white p-12 text-center shadow-xl dark:bg-navy-900"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="font-display text-2xl font-bold text-navy-900 dark:text-white">
          Reservation Submitted!
        </h3>
        <p className="mt-3 text-navy-600 dark:text-navy-400">
          Thank you! We&apos;ve received your reservation and sent a confirmation to your email.
        </p>
        <p className="mt-2 text-sm text-gold-600">
          Redirecting you to WhatsApp in a few seconds...
        </p>
        <div className="mt-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
        </div>
        <a
          href={getWhatsAppUrl(RESERVATION_WHATSAPP_MESSAGE)}
          className="mt-4 inline-block text-sm text-green-600 hover:underline"
        >
          Click here if not redirected automatically
        </a>
      </motion.div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 dark:border-navy-700 dark:bg-navy-800 dark:text-white";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl bg-white p-8 shadow-xl dark:bg-navy-900">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">
            Full Name *
          </label>
          <input {...register("fullName")} className={inputClass} placeholder="John Doe" />
          {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">
            Email *
          </label>
          <input {...register("email")} type="email" className={inputClass} placeholder="john@email.com" />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">
            Phone Number *
          </label>
          <input {...register("phone")} className={inputClass} placeholder="+1 234 567 8900" />
          {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">
            Destination *
          </label>
          <select {...register("destination")} className={inputClass}>
            <option value="">Select destination</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.title}>
                {tour.title} — {tour.country}
              </option>
            ))}
          </select>
          {errors.destination && <p className="mt-1 text-sm text-red-500">{errors.destination.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">
            Departure Date *
          </label>
          <div className="relative">
            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input {...register("departureDate")} type="date" className={`${inputClass} pl-10`} />
          </div>
          {errors.departureDate && <p className="mt-1 text-sm text-red-500">{errors.departureDate.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">
            Return Date *
          </label>
          <div className="relative">
            <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-navy-400" />
            <input {...register("returnDate")} type="date" className={`${inputClass} pl-10`} />
          </div>
          {errors.returnDate && <p className="mt-1 text-sm text-red-500">{errors.returnDate.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">
            Travel Type *
          </label>
          <select {...register("travelType")} className={inputClass}>
            <option value="">Select type</option>
            {travelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.travelType && <p className="mt-1 text-sm text-red-500">{errors.travelType.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">
            Number of Travelers *
          </label>
          <input {...register("travelers")} type="number" min={1} max={20} className={inputClass} />
          {errors.travelers && <p className="mt-1 text-sm text-red-500">{errors.travelers.message}</p>}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-navy-300">
          Additional Notes
        </label>
        <textarea
          {...register("notes")}
          rows={4}
          className={inputClass}
          placeholder="Special requests, dietary requirements, accessibility needs..."
        />
      </div>
      <Button type="submit" size="lg" loading={status === "loading"} className="w-full md:w-auto">
        <Send className="h-4 w-4" />
        Submit Reservation
      </Button>
    </form>
  );
}
