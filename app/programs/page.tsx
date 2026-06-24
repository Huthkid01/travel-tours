import { LiveAnnouncementSidebar } from "@/components/announcements/LiveAnnouncementSidebar";
import { VisaCategoriesSection } from "@/components/home/VisaCategoriesSection";
import { LiveProgramsGrid } from "@/components/programs/LiveProgramsGrid";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { fetchAnnouncements, fetchPrograms } from "@/services/cms";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Visa Programs",
  description:
    "Student study visas, tourist visit visas, and work permits — Canada, UK, Europe, Australia, Serbia, China, and more.",
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
        title="Visa Programs"
        subtitle="Student study visas, tourist visits, and work permits — Canada, UK, Europe, Australia, and more"
        image="https://images.unsplash.com/photo-1469854523086-cc02afe5c88d?w=1920&q=80"
      />
      <VisaCategoriesSection />
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            <div className="min-w-0 flex-1">
              <SectionHeading
                label="All Programs"
                title="Student, Work & Tourist Visas"
                description="Browse every active program. Pricing and requirements are shared after consultation."
              />
              <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:gap-6 lg:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
                <LiveProgramsGrid initialPrograms={programs} variant="compact" liveUpdates />
              </div>
            </div>

            <aside className="hidden shrink-0 lg:block lg:w-72 xl:w-80">
              <div className="sticky top-24">
                <LiveAnnouncementSidebar initialItems={announcements} />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
