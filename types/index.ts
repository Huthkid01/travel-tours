export type PaymentStatus = "pending" | "paid" | "failed";
export type PaymentType = "deposit" | "full" | "booking-fee";
export type PaymentProvider = "paystack" | "flutterwave";

export type ProgramStatus = "active" | "draft" | "archived";
export type AnnouncementType = "promo" | "service" | "notice";

export type VisitorActionType =
  | "form_submit"
  | "service_click"
  | "program_click"
  | "whatsapp_click"
  | "social_click"
  | "payment_attempt"
  | "page_view"
  | "consultation_start";

export interface UploadedFileMeta {
  name: string;
  url: string;
  type: string;
  size: number;
  path?: string;
}

export interface Application {
  id: string;
  service_name: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  purpose: string;
  notes: string | null;
  uploaded_files: UploadedFileMeta[];
  payment_status: PaymentStatus;
  payment_reference: string | null;
  payment_type?: string | null;
  payment_amount?: number | null;
  payment_provider?: string | null;
  created_at: string;
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  purpose: string;
  notes?: string;
}

export type ProgramImageType = "flyer" | "photo";

export interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  /** flyer = show full graphic (object-contain); photo = cover crop */
  imageType?: ProgramImageType;
  status: ProgramStatus;
  badge?: string;
  date: string;
  ctaLink: string;
  optionalPrice?: number | null;
  sortOrder?: number;
}

/** @deprecated Use Program */
export type FeaturedProgram = Program;

export interface MediaShowcaseItem {
  id: string;
  type: "image" | "video";
  title: string;
  category: "travel" | "documents" | "success" | "social";
  src: string;
  externalUrl?: string;
}

export interface SocialPostPreview {
  id: string;
  platform: "instagram" | "tiktok";
  image: string;
  caption: string;
  url: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  interest: string;
  created_at: string;
}

export interface SiteEvent {
  id: string;
  event_type: string;
  page: string;
  metadata: Record<string, string> | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  message: string;
  type: AnnouncementType;
  link?: string | null;
  active: boolean;
  sortOrder?: number;
  startsAt?: string | null;
  endsAt?: string | null;
}

export interface VisitorActivity {
  id: string;
  action_type: VisitorActionType;
  service: string | null;
  source: string | null;
  metadata?: Record<string, string> | null;
  created_at: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  requirements: string[];
  pricing: {
    deposit: number;
    full: number;
    bookingFee: number;
  };
  category: ServiceCategory;
  icon: string;
  processingTime: string;
  featured?: boolean;
}

export type ServiceCategory =
  | "documentation"
  | "travel"
  | "legal"
  | "certification"
  | "booking";

export type FormFieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "select"
  | "file"
  | "checkbox"
  | "country";

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: FormFieldOption[];
  /** Show field only when another field equals value */
  showWhen?: { field: string; value: string };
  accept?: string;
}

export interface ConsultationFormSchema {
  id: string;
  title: string;
  serviceSlug?: string;
  programSlug?: string;
  description?: string;
  fields: FormFieldConfig[];
  enablePayment?: boolean;
  enableFileUpload?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  service: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface EmailApplicationPayload {
  applicationId: string;
  serviceName: string;
  customerName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  purpose: string;
  notes: string;
  fileLinks: string;
  paymentReference: string;
  paymentStatus: string;
  paymentAmount: string;
  timestamp: string;
}
