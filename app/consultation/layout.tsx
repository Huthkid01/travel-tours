import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Consultation",
  description: "Start your consultation — select a service or program and submit your details.",
  path: "/consultation",
});

export default function ConsultationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
