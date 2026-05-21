import { getProgramFlyerPath } from "@/lib/program-flyers";
import type { Program } from "@/types";

/** Mock programs — admin-editable via Supabase `programs` table */
export const programs: Program[] = [
  {
    id: "1",
    slug: "katana-flex-program",
    title: "Katana Flex Program",
    description:
      "Flexible travel and documentation package designed for professionals seeking streamlined visa and travel support with personalized consultation.",
    image: getProgramFlyerPath("katana-flex-program"),
    imageType: "flyer",
    status: "active",
    badge: "Featured",
    date: "2026-05-01",
    ctaLink: "/consultation?program=katana-flex-program",
    optionalPrice: null,
    sortOrder: 1,
  },
  {
    id: "2",
    slug: "special-travel-packages",
    title: "Special Travel Packages",
    description:
      "Curated travel packages including reservations, insurance, and documentation bundles for international destinations.",
    image: getProgramFlyerPath("special-travel-packages"),
    imageType: "flyer",
    status: "active",
    badge: "Popular",
    date: "2026-04-15",
    ctaLink: "/consultation?program=special-travel-packages",
    sortOrder: 2,
  },
  {
    id: "3",
    slug: "holiday-offers",
    title: "Holiday Offers",
    description:
      "Seasonal holiday travel offers with full consultation support for families and groups planning end-of-year trips.",
    image: getProgramFlyerPath("holiday-offers"),
    imageType: "flyer",
    status: "active",
    badge: "Limited",
    date: "2026-06-01",
    ctaLink: "/consultation?program=holiday-offers",
    sortOrder: 3,
  },
  {
    id: "4",
    slug: "visa-campaign",
    title: "Visa Campaign",
    description:
      "Comprehensive visa documentation campaign — proof of funds, employment letters, appointments, and embassy preparation.",
    image: getProgramFlyerPath("visa-campaign"),
    imageType: "flyer",
    status: "active",
    date: "2026-05-10",
    ctaLink: "/consultation?program=visa-campaign",
    sortOrder: 4,
  },
  {
    id: "5",
    slug: "consultation-announcement",
    title: "Consultation Announcement",
    description:
      "Book a one-on-one consultation with our experts. Discuss your documentation, travel, or certification needs before you apply.",
    image: getProgramFlyerPath("consultation-announcement"),
    imageType: "flyer",
    status: "active",
    badge: "New",
    date: "2026-05-19",
    ctaLink: "/consultation",
    sortOrder: 5,
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
