import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description: `Browse documentation and travel services from ${SITE_CONFIG.name}.`,
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
