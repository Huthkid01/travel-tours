import { announcements as localAnnouncements } from "@/data/announcements";
import { programs as localPrograms } from "@/data/programs";
import { getProgramFlyerPath, isProgramFlyerImage } from "@/lib/program-flyers";
import { getSupabaseClient } from "@/supabase/client";
import type { Announcement, Program, ProgramImageType } from "@/types";

function mapProgram(row: Record<string, unknown>): Program {
  const image = String(row.image);
  const imageType = (row.image_type as ProgramImageType | undefined) ??
    (isProgramFlyerImage(image) ? "flyer" : undefined);

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    image: image.startsWith("/") ? image : image || getProgramFlyerPath(String(row.slug)),
    imageType,
    optionalPrice: row.optional_price != null ? Number(row.optional_price) : null,
    status: row.status as Program["status"],
    ctaLink: String(row.cta_link ?? "/consultation"),
    badge: row.badge ? String(row.badge) : undefined,
    date: row.date ? String(row.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
    sortOrder: row.sort_order != null ? Number(row.sort_order) : 0,
  };
}

function mapAnnouncement(row: Record<string, unknown>): Announcement {
  return {
    id: String(row.id),
    message: String(row.message),
    type: row.type as Announcement["type"],
    link: row.link ? String(row.link) : null,
    active: Boolean(row.active),
    sortOrder: row.sort_order != null ? Number(row.sort_order) : 0,
    startsAt: row.starts_at ? String(row.starts_at) : null,
    endsAt: row.ends_at ? String(row.ends_at) : null,
  };
}

async function fetchFromTable(table: "programs" | "featured_programs"): Promise<Program[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return [];
  return data.map(mapProgram);
}

export async function fetchPrograms(): Promise<Program[]> {
  const fromPrograms = await fetchFromTable("programs");
  if (fromPrograms.length) return fromPrograms;

  const legacy = await fetchFromTable("featured_programs");
  if (legacy.length) return legacy;

  return localPrograms
    .filter((p) => p.status === "active")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function fetchProgramBySlug(slug: string): Promise<Program | null> {
  const programs = await fetchPrograms();
  return programs.find((p) => p.slug === slug) ?? null;
}

/** @deprecated */
export const fetchProgramBySlugLegacy = fetchProgramBySlug;

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return localAnnouncements.filter((a) => a.active).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return localAnnouncements.filter((a) => a.active);
  }
  return data.map(mapAnnouncement);
}
