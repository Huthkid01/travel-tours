import { z } from "zod";

export const darboiApplicationSchema = z.object({
  fullLegalName: z.string().min(2, "Full legal name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  sex: z.enum(["male", "female"], { required_error: "Please select sex" }),
  homeAddress: z.string().min(5, "Home address is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  passportNumber: z.string().min(3, "Passport number is required"),
  countryOfChoice: z.string().min(2, "Country of choice is required"),
  preferredProgramme: z.string().min(2, "Preferred programme of study is required"),
  paymentReference: z.string().optional(),
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

/** @deprecated Use darboiApplicationSchema */
export const applicationSchema = darboiApplicationSchema;

export type DarboiApplicationFormValues = z.infer<typeof darboiApplicationSchema>;
export type ApplicationFormValues = DarboiApplicationFormValues;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type PaymentFormValues = z.infer<typeof paymentSchema>;
