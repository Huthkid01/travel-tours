import { SocialGallery } from "@/components/social/SocialGallery";
import { socialPostPreviews } from "@/data/social-posts";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function SocialMediaSection() {
  return (
    <section id="social" className="section-padding bg-navy-950 text-white">
      <div className="container-custom">
        <SectionHeading
          label="Follow Our Journey"
          title="Follow Our Journey"
          description="Preview our latest updates on Instagram and TikTok before you reach out."
          align="center"
          className="[&_h2]:text-white [&_p]:text-navy-300 [&_span]:text-gold-400"
        />
        <div className="mt-14">
          <SocialGallery postPreview={socialPostPreviews} />
        </div>
      </div>
    </section>
  );
}
