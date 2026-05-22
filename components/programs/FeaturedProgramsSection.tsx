import { LiveProgramsGrid } from "@/components/programs/LiveProgramsGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { fetchPrograms } from "@/services/cms";
import { ArrowRight } from "lucide-react";

export async function FeaturedProgramsSection() {
  const programs = await fetchPrograms();

  if (programs.length === 0) return null;

  return (
    <section id="programs" className="section-padding bg-navy-950">
      <div className="container-custom">
        <SectionHeading
          label="Featured Programs"
          title="Programs, Promotions & Special Offers"
          description="Exclusive packages and campaigns. Contact us for consultation — pricing available on request."
          align="center"
          className="[&_h2]:text-white [&_p]:text-navy-300 [&_span]:text-gold-400"
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-3">
          <LiveProgramsGrid initialPrograms={programs} variant="compact" />
        </div>

        <div className="mt-10 text-center">
          <Button href="/programs" variant="secondary">
            View All Programs <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
