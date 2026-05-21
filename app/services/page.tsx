"use client";

import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFilters, filterServices } from "@/components/services/ServiceFilters";
import { PageHero } from "@/components/layout/PageHero";
import { services } from "@/data/services";
import { useMemo, useState } from "react";

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(
    () => filterServices(services, search, category),
    [search, category]
  );

  return (
    <>
      <PageHero
        title="Our Services"
        subtitle="Professional documentation, certification, and travel consultation"
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
      />
      <section className="section-padding">
        <div className="container-custom">
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
        </div>
      </section>
    </>
  );
}
