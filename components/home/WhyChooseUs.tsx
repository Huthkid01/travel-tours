"use client";

import { motion } from "framer-motion";
import { Headphones, LucideIcon, Shield, Sparkles, Wallet } from "lucide-react";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Sparkles,
    title: "Curated Experiences",
    description: "Handpicked destinations and exclusive access to world-class attractions.",
  },
  {
    icon: Shield,
    title: "Travel Protection",
    description: "Comprehensive insurance and 24/7 emergency support on every journey.",
  },
  {
    icon: Wallet,
    title: "Best Value",
    description: "Competitive pricing with transparent fees and flexible payment options.",
  },
  {
    icon: Headphones,
    title: "Personal Concierge",
    description: "Dedicated travel consultants available via WhatsApp at any time.",
  },
];

export function WhyChooseUs() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-navy-100 bg-white p-6 dark:border-navy-800 dark:bg-navy-900 card-hover"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/10">
              <Icon className="h-6 w-6 text-gold-500" />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold text-navy-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-sm text-navy-600 dark:text-navy-400">{feature.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
