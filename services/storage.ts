import { getSupabaseClient } from "@/supabase/client";
import type { UploadedFileMeta } from "@/types";

const BUCKET = "documents";

export async function uploadApplicationFiles(
  serviceSlug: string,
  applicationId: string,
  files: File[]
): Promise<UploadedFileMeta[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
      path: `demo/${serviceSlug}/${applicationId}/${file.name}`,
    }));
  }

  const uploaded: UploadedFileMeta[] = [];

  for (const file of files) {
    const path = `${serviceSlug}/${applicationId}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const signed = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);

    uploaded.push({
      name: file.name,
      url: signed.data?.signedUrl || urlData.publicUrl,
      type: file.type,
      size: file.size,
      path,
    });
  }

  return uploaded;
}
