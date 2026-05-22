/** Pre-filled WhatsApp message per service (slug → text) */
export const SERVICE_WHATSAPP_MESSAGES: Record<string, string> = {
  "marriage-certificate":
    "Hello, I would like assistance with Marriage Certificate processing at Darboi Consults Limited. Please share requirements and pricing.",
  ndlea:
    "Hello, I would like assistance with NDLEA clearance documentation at Darboi Consults Limited. Please share requirements and pricing.",
  "yellow-vaccine-certificate":
    "Hello, I would like assistance with Yellow Vaccine Certificate for international travel at Darboi Consults Limited. Please share requirements and pricing.",
  "employment-documents":
    "Hello, I would like assistance with Employment Documents at Darboi Consults Limited. Please share requirements and pricing.",
  "land-documents":
    "Hello, I would like assistance with Land Documents (title, survey, property) at Darboi Consults Limited. Please share requirements and pricing.",
  "police-character-certificate":
    "Hello, I would like assistance with Police Character Certificate at Darboi Consults Limited. Please share requirements and pricing.",
  "investment-certificate":
    "Hello, I would like assistance with Investment Certificate documentation at Darboi Consults Limited. Please share requirements and pricing.",
  "newspaper-publication":
    "Hello, I would like assistance with Newspaper Publication for legal notice at Darboi Consults Limited. Please share requirements and pricing.",
  "change-of-name":
    "Hello, I would like assistance with Change of Name documentation at Darboi Consults Limited. Please share requirements and pricing.",
  "proof-of-fund":
    "Hello, I would like assistance with Proof of Fund documentation for my visa application at Darboi Consults Limited. Please share requirements and pricing.",
  "flight-reservation":
    "Hello, I would like assistance with Flight Reservation for visa/travel at Darboi Consults Limited. Please share requirements and pricing.",
  "travel-insurance-certificate":
    "Hello, I would like assistance with Travel Insurance Certificate at Darboi Consults Limited. Please share requirements and pricing.",
  "hotel-reservation":
    "Hello, I would like assistance with Hotel Reservation for visa/travel at Darboi Consults Limited. Please share requirements and pricing.",
  "driving-licence":
    "Hello, I would like assistance with Driving Licence application or renewal at Darboi Consults Limited. Please share requirements and pricing.",
  "appointment-booking":
    "Hello, I would like assistance with Embassy/Consulate Appointment Booking at Darboi Consults Limited. Please share requirements and pricing.",
};

export function getServiceWhatsAppPrompt(slug: string, title: string): string {
  return (
    SERVICE_WHATSAPP_MESSAGES[slug] ??
    `Hello, I would like assistance with ${title} at Darboi Consults Limited. Please share requirements and pricing.`
  );
}
