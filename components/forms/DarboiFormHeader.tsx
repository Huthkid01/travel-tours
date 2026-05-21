import { BrandLogo } from "@/components/layout/BrandLogo";
import { SITE_CONFIG } from "@/lib/constants";
import { DARBOI_FORM_MOTTO, PASSPORT_MATCH_NOTE } from "@/data/darboi-application-form";
import { AlertTriangle, Mail, MapPin, Phone } from "lucide-react";

interface DarboiFormHeaderProps {
  title?: string;
  contextLabel?: string;
}

export function DarboiFormHeader({
  title = "Application Form",
  contextLabel,
}: DarboiFormHeaderProps) {
  return (
    <div className="space-y-4 border-b border-navy-100 pb-6 dark:border-navy-800">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <BrandLogo size="footer" className="mx-auto sm:mx-0" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold text-navy-900 dark:text-white">{SITE_CONFIG.name}</p>
          <p className="text-xs italic text-red-600 dark:text-red-400">Motto: {DARBOI_FORM_MOTTO}</p>
          <div className="mt-2 space-y-1 text-xs text-navy-600 dark:text-navy-400">
            <p className="flex items-center justify-center gap-1 sm:justify-start">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-500" />
              {SITE_CONFIG.addressLines.join(", ")}
            </p>
            <p className="flex items-center justify-center gap-1 sm:justify-start">
              <Phone className="h-3.5 w-3.5 shrink-0 text-gold-500" />
              {SITE_CONFIG.phone}
            </p>
            <p className="flex items-center justify-center gap-1 sm:justify-start">
              <Mail className="h-3.5 w-3.5 shrink-0 text-gold-500" />
              <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-gold-600">
                {SITE_CONFIG.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-center font-display text-2xl font-bold tracking-wide text-navy-900 uppercase dark:text-white sm:text-left">
          {title}
        </h2>
        {contextLabel && (
          <p className="mt-1 text-center text-sm text-gold-600 sm:text-left">
            {contextLabel}
          </p>
        )}
      </div>

      <div className="flex gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
        <p>
          <strong>NOTE:</strong> {PASSPORT_MATCH_NOTE}
        </p>
      </div>
      <p className="text-xs text-red-600 dark:text-red-400">* Indicates required question</p>
    </div>
  );
}
