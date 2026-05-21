import { AnnouncementSidebar } from "@/components/announcements/AnnouncementSidebar";
import { ProgramFlyerImage } from "@/components/programs/ProgramFlyerImage";
import { PriceLabel, PricingBlock } from "@/components/ui/PriceLabel";
import { Button } from "@/components/ui/Button";
import { fetchProgramBySlug, fetchPrograms } from "@/services/cms";
import { SITE_CONFIG } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import { isProgramFlyerImage } from "@/lib/program-flyers";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const programs = await fetchPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await fetchProgramBySlug(slug);
  if (!program) return { title: "Program Not Found" };
  return buildPageMetadata({
    title: program.title,
    description: program.description,
    path: `/programs/${slug}`,
    image: program.image.startsWith("/") ? `${SITE_CONFIG.url}${program.image}` : program.image,
  });
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await fetchProgramBySlug(slug);
  if (!program) notFound();

  const isFlyer = isProgramFlyerImage(program.image, program.imageType);

  return (
    <>
      <section className="bg-navy-950 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <div className="container-custom px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-wider text-gold-400 uppercase sm:text-sm">
            {program.badge ?? "Featured Program"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            {program.title}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-navy-300">
            <Calendar className="h-4 w-4 text-gold-500" />
            {formatDate(program.date)}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div
                className={
                  isFlyer
                    ? "mx-auto max-w-lg overflow-hidden rounded-2xl border border-navy-200 bg-navy-950 shadow-2xl dark:border-navy-800"
                    : "overflow-hidden rounded-2xl border border-navy-100 dark:border-navy-800"
                }
              >
                <ProgramFlyerImage
                  program={program}
                  sizes="(max-width: 1024px) 100vw, 512px"
                  priority
                  className={isFlyer ? "max-h-[min(85vh,720px)]" : "max-h-[420px] object-cover"}
                />
              </div>

              <p className="mt-8 text-base leading-relaxed text-navy-600 sm:text-lg dark:text-navy-300">
                {program.description}
              </p>
              <PricingBlock className="mt-8" />
              <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                <Button href={program.ctaLink} size="lg" className="w-full sm:w-auto">
                  Apply Now
                </Button>
                <Button href="/consultation" variant="outline" size="lg" className="w-full sm:w-auto">
                  Book Consultation
                </Button>
              </div>
              <p className="mt-4">
                <PriceLabel variant="contact" className="text-base" />
              </p>
            </div>
            <AnnouncementSidebar />
          </div>
          <div className="mt-12">
            <Link href="/programs" className="text-sm font-medium text-gold-600 hover:underline">
              ← Back to all programs
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
