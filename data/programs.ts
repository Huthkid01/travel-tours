import { getProgramFlyerPath } from "@/lib/program-flyers";
import type { Program } from "@/types";

/** Programs — flyer images in /public/programs/flyers/ */
export const programs: Program[] = [
  {
    id: "1",
    slug: "serbia-warehouse-jobs",
    title: "Serbia — Warehouse Jobs & Work Permits",
    description:
      "Warehouse jobs available in Serbia, Central Region. Gain valuable work experience with accommodation provided, live in Europe, and possible permit extension. Open doors to career opportunities in the Schengen area.",
    image: getProgramFlyerPath("serbia-warehouse-jobs"),
    imageType: "flyer",
    status: "active",
    badge: "Featured",
    date: "2026-05-01",
    ctaLink: "/consultation?program=serbia-warehouse-jobs",
    sortOrder: 1,
  },
  {
    id: "2",
    slug: "serbia-visa",
    title: "Serbia Visa Program",
    description:
      "Start a new journey in Serbia — affordable living, excellent job opportunities, high-quality education and training, a growing job market, and easy work and residence permits. Live, study, and work in Serbia.",
    image: getProgramFlyerPath("serbia-visa"),
    imageType: "flyer",
    status: "active",
    badge: "Popular",
    date: "2026-05-01",
    ctaLink: "/consultation?program=serbia-visa",
    sortOrder: 2,
  },
  {
    id: "3",
    slug: "student-visa",
    title: "Student Visa Support",
    description:
      "We support students through every step of university acceptance and the visa application process. 100% visa success rate, fast processing, accommodation support, and more.",
    image: getProgramFlyerPath("student-visa"),
    imageType: "flyer",
    status: "active",
    badge: "Trusted",
    date: "2026-05-01",
    ctaLink: "/consultation?program=student-visa",
    sortOrder: 3,
  },
  {
    id: "4",
    slug: "france-tourist-visa",
    title: "France Tourist Visa",
    description:
      "Valid international passport, passport photographs, proof of family ties, bank statement and employment evidence (CAC for business owners). Processing 15–30 working days. Visa fee €90 (paid at submission). We guide all supporting documents.",
    image: getProgramFlyerPath("france-tourist-visa"),
    imageType: "flyer",
    status: "active",
    date: "2026-05-10",
    ctaLink: "/consultation?program=france-tourist-visa",
    sortOrder: 4,
  },
  {
    id: "5",
    slug: "turkey-tourist-visa",
    title: "Turkey Tourist Visa",
    description:
      "Unveiling the marvels of Turkey, one step at a time. Tourist visa support for Istanbul, Cappadocia, and more — book your consultation and start your Turkey journey with Darboi Consults.",
    image: getProgramFlyerPath("turkey-tourist-visa"),
    imageType: "flyer",
    status: "active",
    badge: "New",
    date: "2026-05-19",
    ctaLink: "/consultation?program=turkey-tourist-visa",
    sortOrder: 5,
  },
  {
    id: "6",
    slug: "italy-visa",
    title: "Italy Visa Package — Fast & Guaranteed",
    description:
      "ITALY VISA PACKAGE — fast and guaranteed Schengen tourist visa support. Processing in just 3 weeks, with guarantee or your money back. Submissions ongoing in Lagos and Abuja, open to all nationalities. Service fee ₦6,000,000: deposit ₦900,000 before submission, balance after visa approval. No games, no delay — submit your passport and start your Italian journey with Darboi Consults.",
    image: getProgramFlyerPath("italy-visa"),
    imageType: "flyer",
    status: "active",
    badge: "Guaranteed",
    date: "2026-05-19",
    ctaLink: "/consultation?program=italy-visa",
    optionalPrice: 6_000_000,
    sortOrder: 6,
  },
  {
    id: "7",
    slug: "mexico-world-cup-2026",
    title: "FIFA World Cup 2026 — Mexico Visa",
    description:
      "Let Darboi Consults help you get a visa to Mexico — a FIFA World Cup 2026 host country. 6-month Mexico multiple-entry visa, fast-track processing, and stress-free application. Requirements: valid international passport, clear passport photo on white background, and bank statement. Limited slots available — contact us to secure yours.",
    image: getProgramFlyerPath("mexico-world-cup-2026"),
    imageType: "flyer",
    status: "active",
    badge: "Limited Slots",
    date: "2026-05-19",
    ctaLink: "/consultation?program=mexico-world-cup-2026",
    sortOrder: 7,
  },
  {
    id: "8",
    slug: "kosovo-tourist-visa",
    title: "Kosovo 3-Month Tourist Visa",
    description:
      "Get a Kosovo 3-month tourist visa with Darboi Consults Limited. Requirements: international passport, passport photo, passport data page, and deposit. Processing time: 4–6 weeks. WhatsApp or email us to start your application.",
    image: getProgramFlyerPath("kosovo-tourist-visa"),
    imageType: "flyer",
    status: "active",
    badge: "New",
    date: "2026-05-19",
    ctaLink: "/consultation?program=kosovo-tourist-visa",
    sortOrder: 8,
  },
  {
    id: "9",
    slug: "turkey-visa-ambassador",
    title: "Turkey Visa — Ambassador Contact",
    description:
      "Turkey visa available through ambassador contact — no deposit, no statement of account, no extra documents beyond data page scan and passport photo (white background). Hard copy must be sent to Abuja. Biometric at Turkish Embassy Abuja; visa ready within 10 working days after biometrics. Applicants pay visa fee directly at the embassy. Service charge applies — contact us on WhatsApp.",
    image: getProgramFlyerPath("turkey-visa-ambassador"),
    imageType: "flyer",
    status: "active",
    badge: "Fast Track",
    date: "2026-05-19",
    ctaLink: "/consultation?program=turkey-visa-ambassador",
    sortOrder: 9,
  },
  {
    id: "10",
    slug: "schengen-work-visa",
    title: "Schengen Working Visa — EU Jobs",
    description:
      "Schengen working visa with accommodation and work permit available in Denmark, Norway, Sweden, Portugal, and more. Live and work in Europe with full support from Darboi Consults — message us for full details and current openings.",
    image: getProgramFlyerPath("schengen-work-visa"),
    imageType: "flyer",
    status: "active",
    badge: "Work & Stay",
    date: "2026-05-19",
    ctaLink: "/consultation?program=schengen-work-visa",
    sortOrder: 10,
  },
  {
    id: "11",
    slug: "japan-teaching-visa",
    title: "Japan Teaching Visa — September Intake",
    description:
      "Teaching slots for September intake in Japan are now available — teachers only. Once you pass your interview, we proceed with your visa application. Contact us on WhatsApp for cost and requirements.",
    image: getProgramFlyerPath("japan-teaching-visa"),
    imageType: "flyer",
    status: "active",
    badge: "September Intake",
    date: "2026-05-19",
    ctaLink: "/consultation?program=japan-teaching-visa",
    sortOrder: 11,
  },
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
