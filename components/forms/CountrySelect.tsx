"use client";

import { COUNTRIES } from "@/data/countries";
import { cn } from "@/lib/utils";
import type { UseFormRegisterReturn } from "react-hook-form";

interface CountrySelectProps {
  registration: UseFormRegisterReturn;
  className?: string;
  error?: string;
  placeholder?: string;
  id?: string;
}

export function CountrySelect({
  registration,
  className,
  error,
  placeholder = "Select country",
  id,
}: CountrySelectProps) {
  return (
    <>
      <select
        id={id}
        {...registration}
        className={cn(
          className,
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
        )}
        autoComplete="country-name"
      >
        <option value="">{placeholder}</option>
        {COUNTRIES.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </>
  );
}
