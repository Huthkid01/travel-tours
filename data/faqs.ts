import type { FAQ } from "@/types";

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "How does the application process work?",
    answer:
      "Choose your service, complete the online form, upload required documents, make payment, and our team will contact you via WhatsApp to continue processing.",
  },
  {
    id: "2",
    question: "What payment options are available?",
    answer:
      "You can pay a booking fee, a 30% deposit, or the full service amount via Paystack or Flutterwave on our secure payment page.",
  },
  {
    id: "3",
    question: "How long does processing take?",
    answer:
      "Processing times vary by service — typically from 24 hours for travel reservations to 30 days for complex land documentation. Each service page lists estimated timelines.",
  },
  {
    id: "4",
    question: "What file formats can I upload?",
    answer:
      "We accept JPEG, PNG, PDF, and DOCX files up to 10MB each. You can upload multiple documents including passport photographs and certificates.",
  },
  {
    id: "5",
    question: "Is my information secure?",
    answer:
      "Yes. Documents are stored securely in Supabase Storage with private access. Only authorized personnel can view your submissions.",
  },
  {
    id: "6",
    question: "Can I track my application?",
    answer:
      "After submission, you will receive a payment reference. Contact us on WhatsApp with your reference for real-time updates from our team.",
  },
];
