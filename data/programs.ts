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
];

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
