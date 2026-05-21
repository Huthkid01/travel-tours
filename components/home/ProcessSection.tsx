"use client";

import { processSteps } from "@/data/stats";
import { motion } from "framer-motion";
import { FileUp, CreditCard, ClipboardList, Headphones, ListChecks } from "lucide-react";

const icons = [ListChecks, ClipboardList, FileUp, CreditCard, Headphones];

export function ProcessSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {processSteps.map((step, i) => {
        const Icon = icons[i] || ListChecks;
        return (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="relative rounded-2xl border border-navy-100 bg-white p-6 text-center dark:border-navy-800 dark:bg-navy-900"
          >
            <span className="absolute -top-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950">
              {step.step}
            </span>
            <Icon className="mx-auto mt-4 h-8 w-8 text-gold-500" />
            <h3 className="mt-4 font-semibold text-navy-900 dark:text-white">{step.title}</h3>
            <p className="mt-2 text-sm text-navy-600 dark:text-navy-400">{step.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
