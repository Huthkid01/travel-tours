"use client";

import { stats } from "@/data/stats";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Award, Globe, Heart, Users } from "lucide-react";

const iconMap = {
  users: Users,
  globe: Globe,
  award: Award,
  heart: Heart,
};

export function StatsSection() {
  return (
    <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] || Globe;
        return (
          <ScrollReveal key={stat.id} index={index} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500/10">
              <Icon className="h-7 w-7 text-gold-500" />
            </div>
            <p className="font-display text-3xl font-bold text-navy-900 dark:text-white md:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-navy-600 dark:text-navy-400">{stat.label}</p>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
