"use client";

import { serviceCategories } from "@/data/services";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";
import { Search } from "lucide-react";

interface ServiceFiltersProps {
  search: string;
  category: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
}

export function ServiceFilters({
  search,
  category,
  onSearchChange,
  onCategoryChange,
}: ServiceFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-navy-400" />
        <input
          type="search"
          placeholder="Search services..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-navy-200 bg-white py-3 pr-4 pl-12 text-navy-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 dark:border-navy-700 dark:bg-navy-900 dark:text-white"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {serviceCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onCategoryChange(cat.id)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === cat.id
                ? "bg-gold-500 text-navy-950"
                : "bg-navy-100 text-navy-700 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-200"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function filterServices(services: ServiceItem[], search: string, category: string) {
  return services.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.shortDescription.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || s.category === category;
    return matchSearch && matchCat;
  });
}
