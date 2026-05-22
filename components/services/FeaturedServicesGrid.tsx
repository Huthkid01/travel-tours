"use client";

import { ServiceCard } from "@/components/services/ServiceCard";
import { useLiveCms } from "@/hooks/use-live-cms";
import type { ServiceItem } from "@/types";

export function FeaturedServicesGrid({
  initialServices,
}: {
  initialServices: ServiceItem[];
}) {
  const { data: services } = useLiveCms<ServiceItem[]>("/api/services", {
    initial: initialServices,
  });
  const list = (services ?? initialServices).filter((s) => s.featured).slice(0, 6);

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((service, i) => (
        <ServiceCard key={service.slug} service={service} index={i} />
      ))}
    </div>
  );
}
