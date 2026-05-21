import { getAdminSupabase } from "@/supabase/admin";
import type { Announcement, Application, Program, ProgramStatus } from "@/types";

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
  totalApplications: number;
  pendingPayments: number;
  paidApplications: number;
  activePrograms: number;
  activeAnnouncements: number;
}

export async function fetchAdminStats(): Promise<AdminDashboardStats> {
  const supabase = getAdminSupabase();
  if (!supabase) {
    return {
      totalVisits: 0,
      visitsToday: 0,
      totalApplications: 0,
      pendingPayments: 0,
      paidApplications: 0,
      activePrograms: 0,
      activeAnnouncements: 0,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [visits, visitsToday, apps, programs, announcements] = await Promise.all([
    supabase
      .from("visitor_activity")
      .select("*", { count: "exact", head: true })
      .eq("action_type", "page_view"),
    supabase
      .from("visitor_activity")
      .select("*", { count: "exact", head: true })
      .eq("action_type", "page_view")
      .gte("created_at", todayIso),
    supabase.from("applications").select("payment_status"),
    countActivePrograms(),
    supabase
      .from("announcements")
      .select("*", { count: "exact", head: true })
      .eq("active", true),
  ]);

  const applications = apps.data ?? [];
  const pending = applications.filter((a) => a.payment_status === "pending").length;
  const paid = applications.filter((a) => a.payment_status === "paid").length;

  return {
    totalVisits: visits.count ?? 0,
    visitsToday: visitsToday.count ?? 0,
    totalApplications: applications.length,
    pendingPayments: pending,
    paidApplications: paid,
    activePrograms: typeof programs === "number" ? programs : 0,
    activeAnnouncements: announcements.count ?? 0,
  };
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

  const payload = {
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    image: String(row.image),
    optional_price: row.optional_price != null ? Number(row.optional_price) : null,
    status: (row.status as ProgramStatus) || "active",
    cta_link: String(row.cta_link || "/consultation"),
    badge: row.badge ? String(row.badge) : null,
    sort_order: Number(row.sort_order ?? 0),
    updated_at: new Date().toISOString(),
  };

  const table = "featured_programs";

  if (id) {
    const { data, error } = await supabase.from(table).update(payload).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }

  const { data, error } = await supabase.from(table).insert(payload).select().single();
  if (error) throw new Error(error.message);
  return data;
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
