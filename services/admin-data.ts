import {
  DEFAULT_PAYMENT_SETTINGS,
  type PaymentSettings,
} from "@/data/payment-settings-default";
import { programs as localPrograms } from "@/data/programs";
import { services as localServices } from "@/data/services";
import { getAdminSupabase } from "@/supabase/admin";
import type { Announcement, Application, Program, ProgramStatus, ServiceCategory } from "@/types";

const PROGRAM_TABLES = ["programs", "featured_programs"] as const;

async function countActivePrograms(): Promise<number> {
  const supabase = getAdminSupabase();
  if (!supabase) return 0;
  for (const table of PROGRAM_TABLES) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
      .eq("status", "active");
    if (!error && count != null) return count;
  }
  return 0;
}

export interface AdminDashboardStats {
  totalVisits: number;
  visitsToday: number;
  totalServices: number;
  activeServices: number;
  /** All form types: service applications + leads + contact */
  totalFormsSubmitted: number;
  formsSubmittedToday: number;
  totalApplications: number;
  totalLeads: number;
  totalContactMessages: number;
  pendingPayments: number;
  paidApplications: number;
  activePrograms: number;
  activeAnnouncements: number;
}

async function countTable(
  supabase: NonNullable<ReturnType<typeof getAdminSupabase>>,
  table: string,
  options?: { gteCreatedAt?: string; eq?: Record<string, string> }
): Promise<number> {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (options?.gteCreatedAt) query = query.gte("created_at", options.gteCreatedAt);
  if (options?.eq) {
    for (const [key, value] of Object.entries(options.eq)) {
      query = query.eq(key, value);
    }
  }
  const { count, error } = await query;
  if (error) return 0;
  return count ?? 0;
}

export async function fetchAdminStats(): Promise<AdminDashboardStats> {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return {
      totalVisits: 0,
      visitsToday: 0,
      totalServices: localServices.length,
      activeServices: localServices.length,
      totalFormsSubmitted: 0,
      formsSubmittedToday: 0,
      totalApplications: 0,
      totalLeads: 0,
      totalContactMessages: 0,
      pendingPayments: 0,
      paidApplications: 0,
      activePrograms: 0,
      activeAnnouncements: 0,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [
    visits,
    visitsToday,
    servicesTotal,
    servicesActive,
    totalApplications,
    applicationsToday,
    pendingPayments,
    paidApplications,
    totalLeads,
    leadsToday,
    totalContactMessages,
    contactToday,
    programs,
    announcements,
  ] = await Promise.all([
    supabase
      .from("visitor_activity")
      .select("*", { count: "exact", head: true })
      .eq("action_type", "page_view"),
    supabase
      .from("visitor_activity")
      .select("*", { count: "exact", head: true })
      .eq("action_type", "page_view")
      .gte("created_at", todayIso),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase
      .from("services")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    countTable(supabase, "applications"),
    countTable(supabase, "applications", { gteCreatedAt: todayIso }),
    countTable(supabase, "applications", { eq: { payment_status: "pending" } }),
    countTable(supabase, "applications", { eq: { payment_status: "paid" } }),
    countTable(supabase, "leads"),
    countTable(supabase, "leads", { gteCreatedAt: todayIso }),
    countTable(supabase, "contact_submissions"),
    countTable(supabase, "contact_submissions", { gteCreatedAt: todayIso }),
    countActivePrograms(),
    supabase
      .from("announcements")
      .select("*", { count: "exact", head: true })
      .eq("active", true),
  ]);

  const totalFormsSubmitted = totalApplications + totalLeads + totalContactMessages;
  const formsSubmittedToday = applicationsToday + leadsToday + contactToday;

  return {
    totalVisits: visits.count ?? 0,
    visitsToday: visitsToday.count ?? 0,
    totalServices: servicesTotal.count ?? localServices.length,
    activeServices: servicesActive.count ?? localServices.length,
    totalFormsSubmitted,
    formsSubmittedToday,
    totalApplications,
    totalLeads,
    totalContactMessages,
    pendingPayments,
    paidApplications,
    activePrograms: typeof programs === "number" ? programs : 0,
    activeAnnouncements: announcements.count ?? 0,
  };
}

export async function fetchAdminServices(): Promise<Record<string, unknown>[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function upsertAdminService(
  row: Record<string, unknown>,
  id?: string
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const requirementsRaw = row.requirements;
  const requirements = Array.isArray(requirementsRaw)
    ? requirementsRaw
    : typeof requirementsRaw === "string"
      ? requirementsRaw.split("\n").map((s) => s.trim()).filter(Boolean)
      : [];

  const payload = {
    slug: String(row.slug),
    title: String(row.title),
    short_description: String(row.short_description),
    description: String(row.description),
    requirements,
    pricing_deposit: Number(row.pricing_deposit ?? 0),
    pricing_full: Number(row.pricing_full ?? 0),
    pricing_booking_fee: Number(row.pricing_booking_fee ?? 0),
    category: (row.category as ServiceCategory) || "documentation",
    icon: String(row.icon || "FileText"),
    processing_time: String(row.processing_time || "5–10 business days"),
    featured: Boolean(row.featured),
    status: String(row.status || "active"),
    sort_order: Number(row.sort_order ?? 0),
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { data, error } = await supabase.from("services").update(payload).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as Record<string, unknown>;
  }

  const { data, error } = await supabase.from("services").insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function deleteAdminService(id: string): Promise<void> {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchAdminPaymentSettings(): Promise<PaymentSettings> {
  const supabase = getAdminSupabase();
  if (!supabase) return DEFAULT_PAYMENT_SETTINGS;

  const { data, error } = await supabase
    .from("payment_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error || !data) return DEFAULT_PAYMENT_SETTINGS;

  return {
    title: String(data.title),
    feeAmount: Number(data.fee_amount),
    feeAmountLabel: String(data.fee_amount_label),
    bankName: String(data.bank_name),
    accountNumber: String(data.account_number),
    accountName: String(data.account_name),
    afterPaymentNote: String(data.after_payment_note),
    paystackEnabled: Boolean(data.paystack_enabled),
    flutterwaveEnabled: Boolean(data.flutterwave_enabled),
    showBankTransfer: Boolean(data.show_bank_transfer),
  };
}

export async function upsertAdminPaymentSettings(settings: PaymentSettings): Promise<void> {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("payment_settings").upsert({
    id: "default",
    title: settings.title,
    fee_amount: settings.feeAmount,
    fee_amount_label: settings.feeAmountLabel,
    bank_name: settings.bankName,
    account_number: settings.accountNumber,
    account_name: settings.accountName,
    after_payment_note: settings.afterPaymentNote,
    paystack_enabled: settings.paystackEnabled,
    flutterwave_enabled: settings.flutterwaveEnabled,
    show_bank_transfer: settings.showBankTransfer,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

export async function seedAdminProgramsFromLocal(): Promise<number> {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  let count = 0;
  const active = localPrograms.filter((p) => p.status === "active");

  for (const p of active) {
    const { error } = await supabase.from("featured_programs").upsert(
      {
        slug: p.slug,
        title: p.title,
        description: p.description,
        image: p.image,
        optional_price: p.optionalPrice ?? null,
        status: "active",
        cta_link: p.ctaLink ?? `/consultation?program=${p.slug}`,
        badge: p.badge ?? null,
        sort_order: p.sortOrder ?? 0,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );
    if (!error) count += 1;
  }

  return count;
}

export async function seedAdminServicesFromLocal(): Promise<number> {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  let count = 0;
  for (let i = 0; i < localServices.length; i++) {
    const s = localServices[i];
    const { error } = await supabase.from("services").upsert(
      {
        slug: s.slug,
        title: s.title,
        short_description: s.shortDescription,
        description: s.description,
        requirements: s.requirements,
        pricing_deposit: s.pricing.deposit,
        pricing_full: s.pricing.full,
        pricing_booking_fee: s.pricing.bookingFee,
        category: s.category,
        icon: s.icon,
        processing_time: s.processingTime,
        featured: s.featured ?? false,
        status: "active",
        sort_order: i,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    );
    if (!error) count += 1;
  }
  return count;
}

export async function fetchAdminApplications(limit = 50): Promise<Application[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as Application[];
}

export async function fetchAdminPrograms(): Promise<Record<string, unknown>[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];

  for (const table of PROGRAM_TABLES) {
    const { data, error } = await supabase.from(table).select("*").order("sort_order", { ascending: true });
    if (!error && data?.length) return data;
  }
  const { data, error } = await supabase
    .from("featured_programs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function upsertAdminProgram(
  row: Record<string, unknown>,
  id?: string
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const image = String(row.image || "").trim();
  const imageType =
    row.image_type === "flyer" || row.image_type === "photo"
      ? row.image_type
      : image.includes("/programs/flyers") || image.includes("program-flyers")
        ? "flyer"
        : "photo";

  const payload: Record<string, unknown> = {
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    image,
    image_type: imageType,
    optional_price: row.optional_price != null ? Number(row.optional_price) : null,
    status: (row.status as ProgramStatus) || "active",
    cta_link: String(row.cta_link || "/consultation"),
    badge: row.badge ? String(row.badge) : null,
    sort_order: Number(row.sort_order ?? 0),
    updated_at: new Date().toISOString(),
  };

  const table = "featured_programs";

  const save = async () => {
    if (id) {
      return supabase.from(table).update(payload).eq("id", id).select().single();
    }
    return supabase.from(table).insert(payload).select().single();
  };

  let { data, error } = await save();
  if (error?.message?.includes("image_type")) {
    delete payload.image_type;
    ({ data, error } = await save());
  }
  if (error) throw new Error(error.message);
  return data as Record<string, unknown>;
}

export async function deleteAdminProgram(id: string): Promise<void> {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("featured_programs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchAdminAnnouncements(): Promise<Announcement[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => ({
    id: String(row.id),
    message: String(row.message),
    type: row.type as Announcement["type"],
    link: row.link ? String(row.link) : null,
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order ?? 0),
    startsAt: row.starts_at ? String(row.starts_at) : null,
    endsAt: row.ends_at ? String(row.ends_at) : null,
  }));
}

export async function upsertAdminAnnouncement(
  row: Partial<Announcement> & { message: string },
  id?: string
): Promise<void> {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Supabase not configured");

  const payload = {
    message: row.message,
    type: row.type ?? "notice",
    link: row.link ?? null,
    active: row.active ?? true,
    sort_order: row.sortOrder ?? 0,
    starts_at: row.startsAt ?? null,
    ends_at: row.endsAt ?? null,
  };

  if (id) {
    const { error } = await supabase.from("announcements").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase.from("announcements").insert(payload);
  if (error) throw new Error(error.message);
}

export async function deleteAdminAnnouncement(id: string): Promise<void> {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchRecentVisits(limit = 30): Promise<
  { id: string; action_type: string; source: string | null; service: string | null; created_at: string }[]
> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("visitor_activity")
    .select("id, action_type, source, service, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as {
    id: string;
    action_type: string;
    source: string | null;
    service: string | null;
    created_at: string;
  }[];
}
