import { PageHero } from "@/components/layout/PageHero";
import { PaymentCards } from "@/components/payment/PaymentCards";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment",
  description: "Secure payment options via Flutterwave and Paystack. Pay booking fee, deposit, or full amount.",
};

export default function PaymentPage() {
  return (
    <>
      <PageHero
        title="Secure Payment"
        subtitle="Choose your payment type and preferred gateway"
        image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80"
      />

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <SectionHeading
            label="Payment"
            title="Complete Your Payment"
            description="Select a payment option and pay securely via Flutterwave or Paystack"
          />
          <PaymentCards />
        </div>
      </section>
    </>
  );
}
