import { getSupabaseClient } from "@/supabase/client";
import { isSupabaseConfigured } from "@/lib/constants";
import type { Application, ApplicationFormData, PaymentProvider, PaymentStatus, PaymentType, UploadedFileMeta } from "@/types";

const DEMO_STORAGE_KEY = "daboi_applications";

function loadDemoApplications(): Application[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Application[]) : [];
  } catch {
    return [];
  }
}

function saveDemoApplication(app: Application): void {
  const list = loadDemoApplications();
  const idx = list.findIndex((a) => a.id === app.id);
  if (idx >= 0) list[idx] = app;
  else list.push(app);
  sessionStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(list));
}

export function generateApplicationId(): string {
  return crypto.randomUUID();
}

export async function createApplication(
  serviceName: string,
  form: ApplicationFormData,
  uploadedFiles: UploadedFileMeta[],
  id: string = generateApplicationId()
): Promise<Application> {
  const record: Application = {
    id,
    service_name: serviceName,
    full_name: form.fullName,
    email: form.email,
    phone: form.phone,
    country: form.country,
    address: form.address,
    purpose: form.purpose,
    notes: form.notes || null,
    uploaded_files: uploadedFiles,
    payment_status: "pending",
    payment_reference: null,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (!supabase) {
    saveDemoApplication(record);
    return record;
  }

  const { data, error } = await supabase.from("applications").insert({
    id: record.id,
    service_name: record.service_name,
    full_name: record.full_name,
    email: record.email,
    phone: record.phone,
    country: record.country,
    address: record.address,
    purpose: record.purpose,
    notes: record.notes,
    uploaded_files: record.uploaded_files,
    payment_status: record.payment_status,
    payment_reference: record.payment_reference,
  }).select().single();

  if (error) throw new Error(error.message);
  return data as Application;
}

export async function getApplication(id: string): Promise<Application | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return loadDemoApplications().find((a) => a.id === id) ?? null;
  }

  const { data, error } = await supabase.from("applications").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Application;
}

export async function updateApplicationPayment(
  id: string,
  payment: {
    reference: string;
    status: PaymentStatus;
    type: PaymentType;
    amount: number;
    provider: PaymentProvider;
  }
): Promise<Application | null> {
  const supabase = getSupabaseClient();
  const updates = {
    payment_status: payment.status,
    payment_reference: payment.reference,
    payment_type: payment.type,
    payment_amount: payment.amount,
    payment_provider: payment.provider,
  };

  if (!supabase) {
    const apps = loadDemoApplications();
    const app = apps.find((a) => a.id === id);
    if (!app) return null;
    const updated = { ...app, ...updates };
    saveDemoApplication(updated);
    return updated;
  }

  const { data, error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Application;
}

export function isDemoMode(): boolean {
  return !isSupabaseConfigured();
}
