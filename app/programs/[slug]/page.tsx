import { AnnouncementSidebar } from "@/components/announcements/AnnouncementSidebar";
import { PageHero } from "@/components/layout/PageHero";
import { PriceLabel, PricingBlock } from "@/components/ui/PriceLabel";
import { Button } from "@/components/ui/Button";
import { fetchProgramBySlug, fetchPrograms } from "@/services/cms";
import { buildPageMetadata } from "@/lib/seo";
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
    image: program.image,
  });
}

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const program = await fetchProgramBySlug(slug);
  if (!program) notFound();

  return (
    <>
      <PageHero title={program.title} subtitle={program.badge ?? "Featured Program"} image={program.image} />
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-sm text-navy-500">
                <Calendar className="h-4 w-4" />
                {formatDate(program.date)}
              </div>
              <p className="mt-6 text-lg leading-relaxed text-navy-600 dark:text-navy-300">{program.description}</p>
              <PricingBlock className="mt-8" />
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={program.ctaLink} size="lg">Apply Now</Button>
                <Button href="/consultation" variant="outline" size="lg">Book Consultation</Button>
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
