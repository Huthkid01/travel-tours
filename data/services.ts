import type { ServiceItem } from "@/types";

export const services: ServiceItem[] = [
  {
    slug: "marriage-certificate",
    title: "Marriage Certificate",
    shortDescription: "Official marriage certificate processing and verification support.",
    description:
      "We assist with marriage certificate applications, documentation review, and liaison with relevant authorities to ensure your records are complete and compliant.",
    requirements: ["Valid ID", "Marriage affidavit or court record", "Passport photograph", "Witness details if applicable"],
    pricing: { deposit: 85_000, full: 250_000, bookingFee: 35_000 },
    category: "documentation",
    icon: "Heart",
    processingTime: "7–14 business days",
    featured: true,
  },
  {
    slug: "ndlea",
    title: "NDLEA",
    shortDescription: "NDLEA clearance and related documentation assistance.",
    description:
      "Professional support for NDLEA-related documentation, application guidance, and follow-up until your clearance requirements are met.",
    requirements: ["Valid passport or national ID", "Application form", "Passport photograph", "Supporting letters if required"],
    pricing: { deposit: 120_000, full: 350_000, bookingFee: 50_000 },
    category: "certification",
    icon: "ShieldCheck",
    processingTime: "10–21 business days",
    featured: true,
  },
  {
    slug: "yellow-vaccine-certificate",
    title: "Yellow Vaccine Certificate",
    shortDescription: "International yellow fever vaccination certificate support.",
    description:
      "End-to-end assistance for yellow fever vaccination certificates required for international travel, including appointment coordination where applicable.",
    requirements: ["International passport", "Vaccination card if existing", "Travel itinerary", "Passport photograph"],
    pricing: { deposit: 45_000, full: 120_000, bookingFee: 25_000 },
    category: "certification",
    icon: "Syringe",
    processingTime: "3–7 business days",
  },
  {
    slug: "employment-documents",
    title: "Employment Documents",
    shortDescription: "Employment letters, contracts, and work documentation support.",
    description:
      "We help prepare, review, and process employment-related documentation for local and international opportunities.",
    requirements: ["CV/Resume", "Offer letter or employer details", "Valid ID", "Educational certificates"],
    pricing: { deposit: 75_000, full: 220_000, bookingFee: 30_000 },
    category: "documentation",
    icon: "Briefcase",
    processingTime: "5–10 business days",
  },
  {
    slug: "land-documents",
    title: "Land Documents",
    shortDescription: "Land title, survey, and property documentation services.",
    description:
      "Comprehensive support for land documentation including title verification, survey coordination, and deed processing guidance.",
    requirements: ["Proof of ownership or purchase", "Survey plan if available", "Valid ID", "Property address details"],
    pricing: { deposit: 150_000, full: 450_000, bookingFee: 75_000 },
    category: "legal",
    icon: "Landmark",
    processingTime: "14–30 business days",
    featured: true,
  },
  {
    slug: "police-character-certificate",
    title: "Police Character Certificate",
    shortDescription: "Police clearance and character certificate application support.",
    description:
      "We guide you through police character certificate applications for employment, travel, and immigration purposes.",
    requirements: ["Valid ID", "Passport photograph", "Fingerprint card if required", "Application purpose letter"],
    pricing: { deposit: 55_000, full: 150_000, bookingFee: 25_000 },
    category: "certification",
    icon: "BadgeCheck",
    processingTime: "7–14 business days",
  },
  {
    slug: "investment-certificate",
    title: "Investment Certificate",
    shortDescription: "Investment and capital documentation for official purposes.",
    description:
      "Assistance with investment certificates, proof of investment documentation, and related financial compliance paperwork.",
    requirements: ["Bank statements", "Investment proof", "Valid ID", "Company documents if corporate"],
    pricing: { deposit: 200_000, full: 600_000, bookingFee: 100_000 },
    category: "legal",
    icon: "TrendingUp",
    processingTime: "10–21 business days",
  },
  {
    slug: "newspaper-publication",
    title: "Newspaper Publication",
    shortDescription: "Official newspaper publication for legal notices and name changes.",
    description:
      "We coordinate newspaper publications required for legal notices, change of name, and other statutory announcements.",
    requirements: ["Publication content draft", "Valid ID", "Supporting court order if applicable"],
    pricing: { deposit: 40_000, full: 95_000, bookingFee: 20_000 },
    category: "legal",
    icon: "Newspaper",
    processingTime: "3–7 business days",
  },
  {
    slug: "change-of-name",
    title: "Change of Name",
    shortDescription: "Legal change of name documentation and publication support.",
    description:
      "Full support for change of name processes including affidavit preparation, publication, and record updates.",
    requirements: ["Affidavit of change of name", "Valid ID", "Newspaper publication proof", "Passport photograph"],
    pricing: { deposit: 65_000, full: 180_000, bookingFee: 30_000 },
    category: "legal",
    icon: "FilePen",
    processingTime: "14–21 business days",
  },
  {
    slug: "proof-of-fund",
    title: "Proof of Fund",
    shortDescription: "Proof of funds documentation for visa and immigration.",
    description:
      "Professional preparation and presentation of proof of funds documentation for visa applications and embassy requirements.",
    requirements: ["Bank statements (6 months)", "Account officer letter", "Valid passport", "Purpose of funds letter"],
    pricing: { deposit: 100_000, full: 300_000, bookingFee: 50_000 },
    category: "documentation",
    icon: "Wallet",
    processingTime: "5–10 business days",
    featured: true,
  },
  {
    slug: "flight-reservation",
    title: "Flight Reservation",
    shortDescription: "Verifiable flight reservations for visa applications.",
    description:
      "We provide verifiable flight reservation itineraries suitable for visa applications and travel planning.",
    requirements: ["Valid passport", "Travel dates", "Destination details", "Passenger full name"],
    pricing: { deposit: 25_000, full: 65_000, bookingFee: 15_000 },
    category: "travel",
    icon: "Plane",
    processingTime: "24–48 hours",
  },
  {
    slug: "travel-insurance-certificate",
    title: "Travel Insurance Certificate",
    shortDescription: "Travel insurance certificates for visa and travel compliance.",
    description:
      "Obtain compliant travel insurance certificates meeting embassy and Schengen requirements.",
    requirements: ["Valid passport", "Travel dates", "Destination country", "Date of birth"],
    pricing: { deposit: 30_000, full: 85_000, bookingFee: 15_000 },
    category: "travel",
    icon: "Shield",
    processingTime: "24–72 hours",
  },
  {
    slug: "hotel-reservation",
    title: "Hotel Reservation",
    shortDescription: "Verifiable hotel bookings for visa and travel documentation.",
    description:
      "Professional hotel reservation confirmations for visa applications with flexible cancellation options where available.",
    requirements: ["Valid passport", "Check-in/out dates", "City and hotel preference", "Guest names"],
    pricing: { deposit: 20_000, full: 55_000, bookingFee: 12_000 },
    category: "travel",
    icon: "Hotel",
    processingTime: "24–48 hours",
  },
  {
    slug: "driving-licence",
    title: "Driving Licence",
    shortDescription: "Driving licence application and renewal assistance.",
    description:
      "Support for new driving licence applications, renewals, and international driving permit coordination.",
    requirements: ["Valid ID", "Passport photograph", "Learner permit or existing licence", "Medical fitness if required"],
    pricing: { deposit: 50_000, full: 140_000, bookingFee: 25_000 },
    category: "documentation",
    icon: "Car",
    processingTime: "7–14 business days",
  },
  {
    slug: "appointment-booking",
    title: "Appointment Booking",
    shortDescription: "Embassy, consulate, and official appointment scheduling.",
    description:
      "We assist with booking appointments at embassies, consulates, and government offices with preparation guidance.",
    requirements: ["Valid passport", "Application reference if any", "Preferred dates", "Service type details"],
    pricing: { deposit: 35_000, full: 90_000, bookingFee: 20_000 },
    category: "booking",
    icon: "CalendarCheck",
    processingTime: "2–5 business days",
    featured: true,
  },
];

export const serviceCategories = [
  { id: "all", label: "All Services" },
  { id: "documentation", label: "Documentation" },
  { id: "travel", label: "Travel" },
  { id: "legal", label: "Legal" },
  { id: "certification", label: "Certification" },
  { id: "booking", label: "Booking" },
] as const;

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string, limit = 3): ServiceItem[] {
  const current = getServiceBySlug(slug);
  if (!current) return services.slice(0, limit);
  return services.filter((s) => s.slug !== slug && s.category === current.category).slice(0, limit);
}
