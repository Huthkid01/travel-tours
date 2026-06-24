import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { STUDY_ABROAD_HIGHLIGHT } from "@/data/visa-offerings";
import { images } from "@/lib/images";
import { GraduationCap, MapPin } from "lucide-react";
import Image from "next/image";

export function StudyAbroadSection() {
  const { title, lead, body, destinations } = STUDY_ABROAD_HIGHLIGHT;

  return (
    <section id="study-abroad" className="section-padding bg-gradient-to-b from-navy-50 to-white dark:from-navy-900/50 dark:to-navy-950">
      <div className="container-custom">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-navy-100 shadow-xl dark:border-navy-800">
            <Image
              src={images.study}
              alt="Students studying abroad"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-navy-950">
                <GraduationCap className="h-3.5 w-3.5" />
                Flagship service
              </span>
              <p className="mt-2 font-display text-xl font-bold text-white sm:text-2xl">
                Study abroad — high success rate
              </p>
            </div>
          </div>

          <div>
            <SectionHeading label="Study Abroad" title={title} description={lead} />
            <p className="mt-4 text-base leading-relaxed text-navy-600 dark:text-navy-300">{body}</p>

            <div className="mt-6">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-navy-800 dark:text-navy-100">
                <MapPin className="h-4 w-4 text-gold-500" />
                Popular study destinations
              </p>
              <div className="flex flex-wrap gap-2">
                {destinations.map((country) => (
                  <span
                    key={country}
                    className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-sm font-medium text-navy-800 dark:text-gold-200"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/consultation?program=student-visa" size="lg">
                Apply for Study Visa
              </Button>
              <Button href="/programs#visa-categories" variant="outline" size="lg">
                View All Visa Types
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
