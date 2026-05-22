"use client";

import { resolveProgramImageSrc } from "@/lib/admin-program-image";
import { cn } from "@/lib/utils";
import { Eye, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface ProgramImageUploadProps {
  image: string;
  slug: string;
  onImageChange: (url: string) => void;
}

export function ProgramImageUpload({ image, slug, onImageChange }: ProgramImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewSrc = resolveProgramImageSrc(image);
  const hasImage = Boolean(previewSrc);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!slug.trim()) {
        toast.error("Enter a slug first (used for the image folder name)");
        return;
      }
      setUploading(true);
      try {
        const body = new FormData();
        body.append("file", file);
        body.append("slug", slug);
        const res = await fetch("/api/admin/programs/upload", { method: "POST", body });
        const json = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !json.url) throw new Error(json.error || "Upload failed");
        onImageChange(json.url);
        toast.success("Flyer image uploaded");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [slug, onImageChange]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) void uploadFile(file);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-white">
          Program flyer image <span className="text-red-400">*</span>
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          Shown on the home page, programs list, and program detail. Stored in Supabase when uploaded.
        </p>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={cn(
          "relative flex min-h-[140px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 bg-slate-950/80 p-6 transition",
          uploading && "opacity-60"
        )}
      >
        {uploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        ) : (
          <>
            <Upload className="h-8 w-8 text-slate-500" />
            <p className="mt-2 text-sm font-medium text-slate-300">Upload flyer image</p>
            <p className="mt-1 text-xs text-slate-500">Drag and drop or click to select</p>
            <label className="mt-4 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500">
              Choose file
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onPick} />
            </label>
          </>
        )}
      </div>

      <p className="text-xs text-slate-500">
        JPG, PNG, WebP, GIF · max 2MB · recommended 1200×1600px (portrait flyer)
      </p>

      {hasImage && (
        <div>
          <p className="mb-2 text-xs font-medium text-slate-400">Current image (saved in database)</p>
          <div className="flex flex-wrap gap-3">
            <div className="group relative h-28 w-20 overflow-hidden rounded-lg border border-slate-600 bg-slate-950">
              <Image src={previewSrc!} alt="Program flyer" fill className="object-cover" unoptimized />
              <span className="absolute top-1 left-1 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                Primary
              </span>
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="rounded-full bg-white/90 p-1.5 text-slate-900"
                  aria-label="Preview"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onImageChange("")}
                  className="rounded-full bg-red-500 p-1.5 text-white"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="text-xs text-slate-500">Or paste image URL / path</label>
        <div className="mt-1 flex gap-2">
          <div className="relative flex-1">
            <ImageIcon className="absolute top-2.5 left-3 h-4 w-4 text-slate-500" />
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pr-3 pl-10 text-sm text-white"
              value={image}
              onChange={(e) => onImageChange(e.target.value)}
              placeholder="/programs/flyers/my-program.png or https://..."
            />
          </div>
        </div>
      </div>

      {previewOpen && previewSrc && (
        <div
          className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-lg" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewSrc} alt="Preview" className="max-h-[85vh] w-auto rounded-lg object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
