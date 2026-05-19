"use client";

import { ReservationForm } from "./ReservationForm";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function ReservationFormWithParams() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination") || "";

  return <ReservationForm defaultDestination={destination} />;
}

export function ReservationFormWrapper() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 rounded-2xl bg-white p-8 dark:bg-navy-900">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      }
    >
      <ReservationFormWithParams />
    </Suspense>
  );
}
