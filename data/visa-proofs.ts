/** Approved visa samples — personal details redacted in source images */

export interface VisaProof {
  id: string;
  title: string;
  country: string;
  visaType?: string;
  /** Path under /public */
  image: string;
}

export const VISA_PROOFS_DIR = "/proofs/visa";

export const visaProofs: VisaProof[] = [
  {
    id: "serbia-work",
    title: "Serbia — Type D Work Visa Approval",
    country: "Serbia",
    visaType: "Employment (Zapošljavanje) — Issued in Abuja",
    image: `${VISA_PROOFS_DIR}/serbia-work-visa.png`,
  },
  {
    id: "italy-tourist-delivered",
    title: "Italy — Schengen Tourist Visa & Delivery",
    country: "Italy",
    visaType: "Tourist (Schengen) — Issued in Lagos",
    image: `${VISA_PROOFS_DIR}/italy-tourist-delivered.png`,
  },
  {
    id: "spain-schengen",
    title: "Spain — Schengen Visa Approval",
    country: "Spain",
    visaType: "Short-stay (Schengen) — Issued in Lagos",
    image: `${VISA_PROOFS_DIR}/spain-schengen-visa.png`,
  },
  {
    id: "italy-tourist",
    title: "Italy — Schengen Tourist Visa Approval",
    country: "Italy",
    visaType: "Tourist (Schengen) — Issued in Lagos",
    image: `${VISA_PROOFS_DIR}/italy-tourist-visa.png`,
  },
];
