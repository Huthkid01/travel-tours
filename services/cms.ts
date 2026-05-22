import { announcements as localAnnouncements } from "@/data/announcements";
import {
  DEFAULT_PAYMENT_SETTINGS,
  type PaymentSettings,
} from "@/data/payment-settings-default";
import { programs as localPrograms } from "@/data/programs";
import { services as localServices } from "@/data/services";
import { getProgramFlyerPath, isProgramFlyerImage } from "@/lib/program-flyers";
import "server-only";

import { getServerSupabase } from "@/supabase/server";
import type { Announcement, Program, ProgramImageType, ServiceCategory, ServiceItem } from "@/types";

function mapService(row: Record<string, unknown>): ServiceItem {
  const requirements = row.requirements;
  const reqList = Array.isArray(requirements)
    ? (requirements as string[])
    : typeof requirements === "string"
      ? (JSON.parse(requirements) as string[])
      : [];

  return {
    slug: String(row.slug),
    title: String(row.title),
    shortDescription: String(row.short_description),
    description: String(row.description),
    requirements: reqList,
    pricing: {
      deposit: Number(row.pricing_deposit ?? 0),
      full: Number(row.pricing_full ?? 0),
      bookingFee: Number(row.pricing_booking_fee ?? 0),
    },
    category: String(row.category) as ServiceCategory,
    icon: String(row.icon ?? "FileText"),
    processingTime: String(row.processing_time ?? "5–10 business days"),
    featured: Boolean(row.featured),
  };
}

export async function fetchServices(): Promise<ServiceItem[]> {
  const supabase = getServerSupabase();
  if (!supabase) {
    return [...localServices];
  }

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return [...localServices];
  }
  return data.map((row) => mapService(row as Record<string, unknown>));
}

export async function fetchServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const supabase = getServerSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();

    if (!error && data) {
      return mapService(data as Record<string, unknown>);
    }
  }

  return localServices.find((s) => s.slug === slug) ?? null;
}

export async function fetchRelatedServices(slug: string, limit = 3): Promise<ServiceItem[]> {
  const all = await fetchServices();
  const current = all.find((s) => s.slug === slug);
  if (!current) return all.slice(0, limit);
  return all.filter((s) => s.slug !== slug && s.category === current.category).slice(0, limit);
}

function mapProgram(row: Record<string, unknown>): Program {
  const image = String(row.image);
  const imageType = (row.image_type as ProgramImageType | undefined) ??
    (isProgramFlyerImage(image) ? "flyer" : undefined);

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    image:
      image.startsWith("/") || isProgramFlyerImage(image)
        ? image
        : getProgramFlyerPath(String(row.slug)),
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
  const supabase = getServerSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return [];
  return data.map(mapProgram);
}

function getLocalActivePrograms(): Program[] {
  return localPrograms
    .filter((p) => p.status === "active")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

/** DB programs override same slug; local fills Serbia, France, etc. when DB only has sample rows */
function mergeProgramsWithLocal(dbPrograms: Program[]): Program[] {
  const local = getLocalActivePrograms();
  if (!dbPrograms.length) return local;

  const bySlug = new Map(local.map((p) => [p.slug, p]));
  for (const p of dbPrograms) {
    bySlug.set(p.slug, p);
  }
  return Array.from(bySlug.values()).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function fetchPrograms(): Promise<Program[]> {
  const fromPrograms = await fetchFromTable("programs");
  if (fromPrograms.length) return mergeProgramsWithLocal(fromPrograms);

  const legacy = await fetchFromTable("featured_programs");
  if (legacy.length) return mergeProgramsWithLocal(legacy);

  return getLocalActivePrograms();
}

export async function fetchProgramBySlug(slug: string): Promise<Program | null> {
  const programs = await fetchPrograms();
  return programs.find((p) => p.slug === slug) ?? null;
}

/** @deprecated */
export const fetchProgramBySlugLegacy = fetchProgramBySlug;

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const supabase = getServerSupabase();
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

function mapPaymentSettings(row: Record<string, unknown>): PaymentSettings {
  return {
    title: String(row.title ?? DEFAULT_PAYMENT_SETTINGS.title),
    feeAmount: Number(row.fee_amount ?? DEFAULT_PAYMENT_SETTINGS.feeAmount),
    feeAmountLabel: String(row.fee_amount_label ?? DEFAULT_PAYMENT_SETTINGS.feeAmountLabel),
    bankName: String(row.bank_name ?? DEFAULT_PAYMENT_SETTINGS.bankName),
    accountNumber: String(row.account_number ?? DEFAULT_PAYMENT_SETTINGS.accountNumber),
    accountName: String(row.account_name ?? DEFAULT_PAYMENT_SETTINGS.accountName),
    afterPaymentNote: String(row.after_payment_note ?? DEFAULT_PAYMENT_SETTINGS.afterPaymentNote),
    paystackEnabled: row.paystack_enabled !== false,
    flutterwaveEnabled: row.flutterwave_enabled !== false,
    showBankTransfer: row.show_bank_transfer !== false,
  };
}

export async function fetchPaymentSettings(): Promise<PaymentSettings> {
  const supabase = getServerSupabase();
  if (!supabase) return DEFAULT_PAYMENT_SETTINGS;

  const { data, error } = await supabase
    .from("payment_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error || !data) return DEFAULT_PAYMENT_SETTINGS;
  return mapPaymentSettings(data as Record<string, unknown>);
}

export type { PaymentSettings };
