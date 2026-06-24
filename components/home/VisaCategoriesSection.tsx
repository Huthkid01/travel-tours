import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VISA_CATEGORIES, type VisaCategoryId } from "@/data/visa-offerings";
import { cn } from "@/lib/utils";
import { Briefcase, Camera, GraduationCap } from "lucide-react";

const ICONS: Record<VisaCategoryId, typeof Camera> = {
  tourist: Camera,
  student: GraduationCap,
  work: Briefcase,
};

const ACCENTS: Record<VisaCategoryId, string> = {
  tourist: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  student: "border-gold-500/40 bg-gold-500/10 text-gold-800 dark:text-gold-300",
  work: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
};

export function VisaCategoriesSection() {
  return (
    <section id="visa-categories" className="section-padding bg-white dark:bg-navy-950">
      <div className="container-custom">
        <SectionHeading
          label="Visa Services"
          title="Tourist, Student & Work Visas"
          description="Darboi Consults supports tourist visits, student study abroad, and work relocation — across Europe, the Americas, Asia-Pacific, and the Middle East."
          align="center"
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {VISA_CATEGORIES.map((category) => {
            const Icon = ICONS[category.id];
            const href = category.consultationProgram
              ? `/consultation?program=${category.consultationProgram}`
              : "/consultation";

            return (
              <article
                key={category.id}
                className="flex flex-col rounded-2xl border border-navy-100 bg-navy-50/50 p-6 shadow-sm dark:border-navy-800 dark:bg-navy-900/40"
              >
                <div
                  className={cn(
                    "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border",
                    ACCENTS[category.id]
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-navy-900 dark:text-white">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-gold-600 dark:text-gold-400">
                  {category.subtitle}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                  {category.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {category.countries.map((country) => (
                    <span
                      key={country}
                      className="rounded-md bg-white px-2 py-0.5 text-xs text-navy-700 ring-1 ring-navy-200 dark:bg-navy-950 dark:text-navy-200 dark:ring-navy-700"
                    >
                      {country}
                    </span>
                  ))}
                </div>
                <Button href={href} variant="secondary" className="mt-6 w-full">
                  Start application
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
