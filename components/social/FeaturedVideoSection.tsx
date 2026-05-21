import { FeaturedVideoPlayer } from "@/components/media/FeaturedVideoPlayer";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FeaturedVideoSection() {
  return (
    <section id="video" className="section-padding bg-white dark:bg-navy-950">
      <div className="container-custom">
        <SectionHeading
          label="Watch"
          title="Latest from Darboi Consults"
          description="Play our featured update here — visa opportunities, travel tips, and client wins."
          align="center"
        />
        <div className="mt-10">
          <FeaturedVideoPlayer />
        </div>
      </div>
    </section>
  );
}
