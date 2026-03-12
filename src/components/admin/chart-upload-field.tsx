"use client";

import { useState, useTransition } from "react";

import { Input } from "@/components/ui/input";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/utils";

export function ChartUploadField({
  defaultValue,
  disabled,
}: {
  defaultValue?: string | null;
  disabled?: boolean;
}) {
  const labelClassName =
    "mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground";
  const [value, setValue] = useState(defaultValue ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleUpload = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!isSupabaseConfigured()) {
      setMessage("Supabase must be configured before file uploads are available.");
      return;
    }

    startTransition(async () => {
      const supabase = createBrowserSupabaseClient();
      const filePath = `${crypto.randomUUID()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;
      const { error } = await supabase.storage.from("trade-charts").upload(filePath, file, {
        upsert: true,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("trade-charts").getPublicUrl(filePath);

      setValue(publicUrl);
      setMessage("Chart image uploaded.");
    });
  };

  return (
    <div className="space-y-3">
      <input name="chart_image_url" type="hidden" value={value} />
      <div>
        <label className={labelClassName}>Chart image URL</label>
        <Input
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://..."
          value={value}
        />
      </div>
      <div>
        <label className={labelClassName}>Or upload chart image</label>
        <Input
          accept="image/*"
          disabled={disabled || isPending}
          onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
          type="file"
        />
      </div>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </div>
  );
}
