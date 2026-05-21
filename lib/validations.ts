import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  country: z.string().min(2, "Country is required"),
  address: z.string().min(5, "Address is required"),
  purpose: z.string().min(3, "Purpose is required"),
  notes: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const paymentSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
