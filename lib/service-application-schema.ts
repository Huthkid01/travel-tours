import type { ServiceApplicationFormConfig } from "@/data/service-application-forms";
import { z } from "zod";

export function buildServiceApplicationSchema(config: ServiceApplicationFormConfig) {
  const shape: Record<string, z.ZodTypeAny> = {
    fullLegalName: z.string().min(2, "Full legal name is required"),
    homeAddress: z.string().min(5, "Home address is required"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    paymentReference: z.string().optional(),
  };

  const fields = config.fields ?? {};

  if (fields.dateOfBirth) {
    shape.dateOfBirth = z.string().min(1, "Date of birth is required");
  }
  if (fields.maritalStatus) {
    shape.maritalStatus = z.string().min(1, "Marital status is required");
  }
  if (fields.sex) {
    shape.sex = z.enum(["male", "female"], { required_error: "Please select sex" });
  }
  if (fields.idNumber) {
    shape.idOrPassportNumber = fields.idNumberRequired
      ? z.string().min(2, `${fields.idNumberLabel ?? "ID number"} is required`)
      : z.string().optional();
  }
  if (fields.passportNumber) {
    shape.passportNumber = z.string().min(3, "Passport number is required");
  }
  if (fields.travelDestination) {
    shape.travelDestination = z.string().min(2, "Destination is required");
  }
  if (fields.travelDates) {
    shape.travelDates = z.string().min(2, "Travel dates are required");
  }
  if (fields.witnessOrAdditionalInfo) {
    shape.witnessOrAdditionalInfo = z.string().optional();
  }

  const purposeRequired = config.purposeRequired !== false;
  shape.purposeDetails = purposeRequired
    ? z.string().min(2, `${config.purposeLabel ?? "Details"} is required`)
    : z.string().optional();

  return z.object(shape);
}

export type ServiceApplicationFormValues = z.infer<ReturnType<typeof buildServiceApplicationSchema>>;
