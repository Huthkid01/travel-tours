"use client";

import { ACCEPTED_FILE_EXTENSIONS, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { FileText, ImageIcon, Trash2, Upload } from "lucide-react";
import { useCallback, useState } from "react";

interface DocumentUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  error?: string;
  maxFiles?: number;
}

export function DocumentUpload({ files, onChange, error, maxFiles = 5 }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const validateAndAdd = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
      const valid = list.filter(
        (f) =>
          (ACCEPTED_FILE_TYPES.includes(f.type) || f.name.match(/\.(pdf|doc|docx|jpe?g|png|webp)$/i)) &&
          f.size <= maxBytes
      );
      const merged = [...files, ...valid].slice(0, maxFiles);
      onChange(merged);
    },
    [files, onChange, maxFiles]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length) validateAndAdd(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={cn(
          "relative rounded-2xl border-2 border-dashed p-8 text-center transition-all",
          dragActive
            ? "border-gold-500 bg-gold-500/5"
            : "border-navy-200 hover:border-gold-400 dark:border-navy-700",
          error && "border-red-400"
        )}
      >
        <input
          type="file"
          multiple
          accept={ACCEPTED_FILE_EXTENSIONS}
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => e.target.files && validateAndAdd(e.target.files)}
        />
        <Upload className="mx-auto h-10 w-10 text-gold-500" />
        <p className="mt-3 font-medium text-navy-900 dark:text-white">Drag & drop files here</p>
        <p className="mt-1 text-sm text-navy-500">
          PDF, document, or image — up to {maxFiles} files, max {MAX_FILE_SIZE_MB}MB each
        </p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/50 p-3 dark:border-navy-800 dark:bg-navy-900/50"
            >
              {file.type.startsWith("image/") ? (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
                </div>
              ) : file.type.includes("pdf") ? (
                <FileText className="h-8 w-8 shrink-0 text-red-500" />
              ) : (
                <ImageIcon className="h-8 w-8 shrink-0 text-gold-500" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-navy-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="rounded-lg p-2 text-navy-400 hover:bg-red-50 hover:text-red-500"
                aria-label="Remove file"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
