import "server-only";

import { getServerSupabase } from "@/supabase/server";
import { isSupabaseServerConfigured } from "@/lib/env.server";
import type {
  Application,
  ApplicationFormData,
  PaymentProvider,
  PaymentStatus,
  PaymentType,
  UploadedFileMeta,
} from "@/types";

function buildApplicationRecord(
  serviceName: string,
  form: ApplicationFormData,
  uploadedFiles: UploadedFileMeta[],
  id: string
): Application {
  return {
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
}

/** Create or update application (keeps existing files when new upload list is empty) */
export async function upsertApplicationServer(
  serviceName: string,
  form: ApplicationFormData,
  id: string,
  uploadedFiles?: UploadedFileMeta[]
): Promise<Application> {
  let files = uploadedFiles ?? [];
  if (files.length === 0) {
    const existing = await getApplicationServer(id);
    if (existing?.uploaded_files?.length) {
      files = existing.uploaded_files;
    }
  }

  const record = buildApplicationRecord(serviceName, form, files, id);

  const supabase = getServerSupabase();
  if (!supabase) return record;

  const { data, error } = await supabase
    .from("applications")
    .upsert(
      {
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
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Application;
}

/** @deprecated Use upsertApplicationServer */
export async function createApplicationServer(
  serviceName: string,
  form: ApplicationFormData,
  uploadedFiles: UploadedFileMeta[],
  id: string
): Promise<Application> {
  return upsertApplicationServer(serviceName, form, id, uploadedFiles);
}

export async function getApplicationServer(id: string): Promise<Application | null> {
  const supabase = getServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.from("applications").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Application;
}

export async function updateApplicationPaymentServer(
  id: string,
  payment: {
    reference: string;
    status: PaymentStatus;
    type: PaymentType;
    amount: number;
    provider: PaymentProvider;
  }
): Promise<Application | null> {
  const supabase = getServerSupabase();
  if (!supabase) return null;

  const updates = {
    payment_status: payment.status,
    payment_reference: payment.reference,
    payment_type: payment.type,
    payment_amount: payment.amount,
    payment_provider: payment.provider,
  };

  const { data, error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Application;
}

export function isServerDemoMode(): boolean {
  return !isSupabaseServerConfigured();
}
