import type { Announcement } from "@/types";

/** Mock announcements JSON — sync with Supabase when connected */
export const announcements: Announcement[] = [
  {
    id: "1",
    message: "New service available — Appointment Booking now open",
    type: "service",
    link: "/services/appointment-booking",
    active: true,
    sortOrder: 1,
  },
  {
    id: "2",
    message: "Serbia warehouse jobs & work permits — apply now",
    type: "promo",
    link: "/programs/serbia-warehouse-jobs",
    active: true,
    sortOrder: 2,
  },
  {
    id: "3",
    message: "Office hours extended for December consultations",
    type: "notice",
    link: "/contact",
    active: true,
    sortOrder: 3,
  },
  {
    id: "4",
    message: "France & Turkey tourist visa support — book consultation",
    type: "notice",
    link: "/programs/france-tourist-visa",
    active: true,
    sortOrder: 4,
  },
];
