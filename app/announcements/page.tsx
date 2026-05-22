import { LiveAnnouncementsList } from "@/components/announcements/LiveAnnouncementsList";
import { PageHero } from "@/components/layout/PageHero";
import { fetchAnnouncements } from "@/services/cms";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Announcements",
  description: "Latest updates, promotions, and service notices from Da Boi Consults Limited.",
  path: "/announcements",
});

export default async function AnnouncementsPage() {
  const items = await fetchAnnouncements();

  return (
    <>
      <PageHero title="Announcements" subtitle="News, updates, and promotional notices" />
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <LiveAnnouncementsList initialItems={items} />
        </div>
      </section>
    </>
  );
}
