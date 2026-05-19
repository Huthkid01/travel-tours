import { z } from "zod";

export const reservationSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    destination: z.string().min(1, "Please select a destination"),
    departureDate: z.string().min(1, "Departure date is required"),
    returnDate: z.string().min(1, "Return date is required"),
    travelType: z.string().min(1, "Please select travel type"),
    travelers: z.coerce.number().min(1, "At least 1 traveler required").max(20),
    notes: z.string().optional(),
  })
  .refine(
    (data) => new Date(data.returnDate) >= new Date(data.departureDate),
    { message: "Return date must be after departure date", path: ["returnDate"] }
  );

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const paymentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
