export type VisaCategoryId = "tourist" | "student" | "work";

export interface VisaCategory {
  id: VisaCategoryId;
  title: string;
  subtitle: string;
  description: string;
  countries: string[];
  consultationProgram?: string;
}

export const VISA_CATEGORIES: VisaCategory[] = [
  {
    id: "tourist",
    title: "Tourist Visit Visa",
    subtitle: "Holiday & short-stay travel",
    description:
      "We prepare and guide tourist visa applications with document checks, appointment support, and embassy-ready files.",
    countries: [
      "Italy",
      "France",
      "United Kingdom",
      "Canada",
      "Brazil",
      "Australia",
      "New Zealand",
      "Ireland",
      "Spain",
      "Germany",
      "Netherlands",
      "and across Europe",
    ],
    consultationProgram: "france-tourist-visa",
  },
  {
    id: "student",
    title: "Student Study Visa",
    subtitle: "Our highest success rate",
    description:
      "From university admission to visa filing — we support students through acceptance, documentation, and embassy submission.",
    countries: [
      "Hungary",
      "Malta",
      "United Kingdom",
      "Scotland",
      "Ireland",
      "United States",
      "Australia",
      "Canada",
      "New Zealand",
      "France",
      "China",
      "Philippines",
      "Germany",
      "Turkey",
      "Serbia",
      "and across Europe",
    ],
    consultationProgram: "student-visa",
  },
  {
    id: "work",
    title: "Work Visa",
    subtitle: "Jobs abroad & relocation",
    description:
      "Work permits and employment visas with document preparation, employer coordination, and step-by-step guidance.",
    countries: [
      "Ireland",
      "United Kingdom",
      "Australia",
      "New Zealand",
      "Canada",
      "Serbia",
      "Oman",
      "Kuwait",
      "Saudi Arabia",
      "Netherlands",
      "Latvia",
      "Turkey",
      "and across Europe",
    ],
    consultationProgram: "work-visa-international",
  },
];

export const STUDY_ABROAD_HIGHLIGHT = {
  title: "Student Admission & Study Visas",
  lead: "One of our strongest results at Darboi Consults is securing student admission and study visas abroad.",
  body: "We guide you from school selection and admission letters through visa documentation, proof of funds, and embassy appointments — for Canada, the UK, Europe, Turkey, Serbia, China, and many more destinations.",
  destinations: [
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Hungary",
    "Malta",
    "Ireland",
    "Australia",
    "USA",
    "China",
    "Turkey",
    "Serbia",
  ],
};
