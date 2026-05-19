export interface Tour {
  id: string;
  slug: string;
  title: string;
  country: string;
  duration: string;
  price: number;
  currency: string;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  included: string[];
  featured?: boolean;
  rating?: number;
  reviews?: number;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  tours: number;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  tour: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface ReservationFormData {
  fullName: string;
  email: string;
  phone: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  travelType: string;
  travelers: number;
  notes?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export type PaymentType = "deposit" | "full" | "booking-fee";
export type PaymentProvider = "flutterwave" | "paystack";

export interface PaymentOption {
  id: PaymentType;
  title: string;
  description: string;
  percentage?: number;
  fixedAmount?: number;
}
