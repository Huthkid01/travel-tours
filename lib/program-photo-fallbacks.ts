import { images } from "@/lib/images";

/** Photo URLs for visa programs — kept separate to avoid circular imports with data/programs.ts */
export const PROGRAM_PHOTO_FALLBACKS: Record<string, string> = {
  "canada-student-visa": images.canada,
  "uk-student-visa": images.uk,
  "china-student-visa": images.china,
  "australia-student-visa": images.australia,
  "usa-student-visa": images.usa,
  "germany-student-visa": images.germany,
  "ireland-student-visa": images.ireland,
  "work-visa-international": images.work,
  "uk-work-visa": images.uk,
  "canada-work-visa": images.canada,
  "ireland-work-visa": images.ireland,
  "australia-work-visa": images.australia,
  "kuwait-work-visa": images.desert,
  "saudi-work-visa": images.desert,
  "netherlands-work-visa": images.europe,
  "latvia-work-visa": images.europe,
  "oman-work-visa": images.desert,
  "uk-tourist-visa": images.uk,
  "canada-tourist-visa": images.canada,
  "brazil-tourist-visa": images.brazil,
  "australia-tourist-visa": images.australia,
  "new-zealand-tourist-visa": images.newzealand,
  "ireland-tourist-visa": images.ireland,
};
