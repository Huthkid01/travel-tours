"use client";

import { useAnnouncementVisible } from "@/components/layout/AnnouncementContext";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { RoutePrefetcher } from "@/components/layout/RoutePrefetcher";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const announcementVisible = useAnnouncementVisible();

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <RoutePrefetcher />
      <NavigationProgress />
      <SiteChrome />
      <Navbar />
      <main
        className={cn(
          "min-h-screen transition-[padding] duration-300",
          announcementVisible ? "pt-28 sm:pt-[7.25rem]" : "pt-20"
        )}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
