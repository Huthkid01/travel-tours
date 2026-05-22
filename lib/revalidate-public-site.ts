import { revalidatePath } from "next/cache";

/** Bust Next.js page cache after admin CMS changes so the next request is fresh. */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/programs");
  revalidatePath("/services");
  revalidatePath("/announcements");
  revalidatePath("/consultation");
}
