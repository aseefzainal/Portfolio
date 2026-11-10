"use client";

import { useRef } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fileToProjectImageDataUrl } from "@/lib/profile-photo";
import { cn } from "@/lib/utils";

export function ProjectImageField({
  image,
  disabled = false,
  onImageChange,
  onImageClear,
  onError,
  onBusyChange,
}: {
  image: string;
  disabled?: boolean;
  onImageChange: (image: string) => void;
  onImageClear: () => void;
  onError: (message: string) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    onError("");
    onBusyChange?.(true);
    try {
      onImageChange(await fileToProjectImageDataUrl(file));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Could not read that image.");
    } finally {
      onBusyChange?.(false);
    }
  }

  return (
    <div className="grid gap-2">
      <Label>Project image</Label>
      <div className="relative w-fit">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          aria-label={image ? "Change project image" : "Upload project image"}
          className={cn(
            "group relative flex h-28 w-44 items-center justify-center overflow-hidden rounded-lg bg-muted ring-1 ring-border transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {image ? (
            <img src={image} alt="" className="size-full object-cover" />
          ) : (
            <span className="grid place-items-center gap-1 text-muted-foreground">
              <ImageIcon className="size-5" />
              <span className="text-xs">Upload image</span>
            </span>
          )}
          <span className="absolute inset-0 grid place-items-center bg-black/45 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {image ? "Change" : "Upload"}
          </span>
        </button>
        {image ? (
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            disabled={disabled}
            className="absolute -top-1.5 -right-1.5 rounded-full bg-background"
            aria-label="Remove project image"
            onClick={onImageClear}
          >
            <XIcon className="size-3" />
          </Button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={handleFile}
      />
      <p className="text-xs text-muted-foreground">
        This image appears on the homepage project cards only — not on the resume.
      </p>
    </div>
  );
}
