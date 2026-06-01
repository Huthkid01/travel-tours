import { LiveAnnouncementSidebar } from "@/components/announcements/LiveAnnouncementSidebar";
import { LiveProgramsGrid } from "@/components/programs/LiveProgramsGrid";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fetchAnnouncements, fetchPrograms } from "@/services/cms";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Featured Programs",
  description: "Explore travel packages, promotions, and special consultation programs.",
  path: "/programs",
});

export default async function ProgramsPage() {
  const [programs, announcements] = await Promise.all([
    fetchPrograms(),
    fetchAnnouncements(),
  ]);

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
              <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 [&>*]:min-w-0">
                <LiveProgramsGrid initialPrograms={programs} variant="compact" liveUpdates />
              </div>
            </div>
            <div className="lg:col-span-1">
              <LiveAnnouncementSidebar initialItems={announcements} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
