"use client";

import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFilters, filterServices } from "@/components/services/ServiceFilters";
import type { ServiceItem } from "@/types";
import { useMemo, useState } from "react";

export function ServicesPageClient({ services }: { services: ServiceItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(
    () => filterServices(services, search, category),
    [services, search, category]
  );

  return (
    <>
      <ServiceFilters
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />
      <p className="mt-4 text-sm text-navy-500">
        Showing {filtered.length} of {services.length} services
      </p>
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-navy-600">No services match your search.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
