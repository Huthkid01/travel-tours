"use client";

import { Button } from "@/components/ui/Button";
import { paymentSchema, type PaymentFormValues } from "@/lib/validations";
import {
  generatePaymentReference,
  getPaymentAmount,
  getPaymentLabel,
  initiateFlutterwavePayment,
  initiatePaystackPayment,
} from "@/services/payment";
import type { PaymentProvider, PaymentType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CreditCard, Percent, Wallet } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

const paymentTypes: { id: PaymentType; icon: typeof Wallet; description: string }[] = [
  { id: "booking-fee", icon: Wallet, description: "Secure your spot with a small booking fee" },
  { id: "deposit", icon: Percent, description: "Pay 30% now, balance before departure" },
  { id: "full", icon: CreditCard, description: "Complete payment for your entire trip" },
];

const BASE_TOUR_PRICE = 5_000_000;

export function PaymentCards() {
  const [selectedType, setSelectedType] = useState<PaymentType>("deposit");
  const [processing, setProcessing] = useState<PaymentProvider | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  const amount = getPaymentAmount(selectedType, BASE_TOUR_PRICE);

  const processPayment = (provider: PaymentProvider) =>
    handleSubmit((data) => {
      setProcessing(provider);
      const config = {
        amount,
        email: data.email,
        name: data.name,
        reference: generatePaymentReference(),
        type: selectedType,
        provider,
      };

      try {
        if (provider === "flutterwave") {
          initiateFlutterwavePayment(config);
        } else {
          initiatePaystackPayment(config);
        }
        toast.success(`Opening ${provider === "flutterwave" ? "Flutterwave" : "Paystack"} checkout...`);
      } catch {
        toast.error("Payment initialization failed");
      } finally {
        setTimeout(() => setProcessing(null), 2000);
      }
    });

  const inputClass =
    "w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-navy-900 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20 dark:border-navy-700 dark:bg-navy-800 dark:text-white";

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        {paymentTypes.map((type, index) => {
          const Icon = type.icon;
          const typeAmount = getPaymentAmount(type.id, BASE_TOUR_PRICE);
          const isSelected = selectedType === type.id;

          return (
            <motion.button
              key={type.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedType(type.id)}
              className={`rounded-2xl border-2 p-6 text-left transition-all ${
                isSelected
                  ? "border-gold-500 bg-gold-500/5 shadow-lg shadow-gold-500/10"
                  : "border-navy-100 bg-white hover:border-gold-300 dark:border-navy-800 dark:bg-navy-900"
              }`}
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${isSelected ? "bg-gold-500 text-navy-950" : "bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300"}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold text-navy-900 dark:text-white">
                {getPaymentLabel(type.id)}
              </h3>
              <p className="mt-1 text-sm text-navy-600 dark:text-navy-400">{type.description}</p>
              <p className="mt-4 text-2xl font-bold text-gold-600">{formatPrice(typeAmount)}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-navy-900">
        <h3 className="mb-6 font-display text-xl font-semibold text-navy-900 dark:text-white">
          Payment Details
        </h3>
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Full Name *</label>
            <input {...register("name")} className={inputClass} placeholder="John Doe" />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email *</label>
            <input {...register("email")} type="email" className={inputClass} placeholder="john@email.com" />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-navy-50 p-4 dark:bg-navy-800">
          <div className="flex justify-between text-sm">
            <span className="text-navy-600 dark:text-navy-400">Payment Type</span>
            <span className="font-medium">{getPaymentLabel(selectedType)}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-navy-600 dark:text-navy-400">Amount Due</span>
            <span className="text-xl font-bold text-gold-600">{formatPrice(amount)}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            type="button"
            onClick={() => void processPayment("flutterwave")()}
            loading={processing === "flutterwave"}
            className="w-full bg-[#F5A623] hover:bg-[#e09515]"
          >
            Pay with Flutterwave
          </Button>
          <Button
            type="button"
            onClick={() => void processPayment("paystack")()}
            loading={processing === "paystack"}
            variant="secondary"
            className="w-full"
          >
            Pay with Paystack
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-navy-500">
          Demo mode — payments use test keys. No real charges will be made.
        </p>
      </div>
    </div>
  );
}
