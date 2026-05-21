import { ProgramsCarousel } from "@/components/programs/ProgramsCarousel";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { AnnouncementSidebar } from "@/components/announcements/AnnouncementSidebar";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fetchPrograms } from "@/services/cms";
import { buildPageMetadata } from "@/lib/seo";
export const metadata = buildPageMetadata({
  title: "Featured Programs",
  description: "Explore travel packages, promotions, and special consultation programs.",
  path: "/programs",
});

export default async function ProgramsPage() {
  const programs = await fetchPrograms();

  return (
    <>
      <PageHero
        title="Featured Programs"
        subtitle="Promotions, travel packages, and special offers — consultation required for details"
        image="https://images.unsplash.com/photo-1469854523086-cc02afe5c88d?w=1920&q=80"
      />
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionHeading
                label="Programs"
                title="Current Offers & Campaigns"
                description="Browse our featured programs. Pricing available on request after consultation."
              />
              <div className="mt-10 hidden lg:block">
                <ProgramsCarousel programs={programs} />
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:hidden">
                {programs.map((p, i) => (
                  <ProgramCard key={p.id} program={p} index={i} />
                ))}
              </div>
              <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-2">
                {programs.map((p, i) => (
                  <ProgramCard key={`g-${p.id}`} program={p} index={i} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <AnnouncementSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
