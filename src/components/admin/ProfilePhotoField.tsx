"use client";

import { useRef } from "react";
import { CameraIcon, CircleIcon, SquareIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  fileToProfilePhotoDataUrl,
  parseProfilePhotoShape,
  profilePhotoShapeClass,
  profilePhotoShapes,
  type ProfilePhotoShape,
} from "@/lib/profile-photo";
import { cn } from "@/lib/utils";

const shapeMeta: Record<
  ProfilePhotoShape,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  circle: { label: "Circle", icon: CircleIcon },
  rounded: { label: "Rounded", icon: RoundedSquareIcon },
  square: { label: "Square", icon: SquareIcon },
};

function RoundedSquareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="5" ry="5" />
    </svg>
  );
}

export function ProfilePhotoField({
  photo,
  photoShape,
  disabled = false,
  onPhotoChange,
  onPhotoClear,
  onShapeChange,
  onError,
  onBusyChange,
}: {
  photo: string;
  photoShape: string;
  disabled?: boolean;
  onPhotoChange: (photo: string) => void;
  onPhotoClear: () => void;
  onShapeChange: (shape: ProfilePhotoShape) => void;
  onError: (message: string) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const shape = parseProfilePhotoShape(photoShape);

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    onError("");
    onBusyChange?.(true);
    try {
      onPhotoChange(await fileToProfilePhotoDataUrl(file));
    } catch (error) {
      onError(error instanceof Error ? error.message : "Could not read that image.");
    } finally {
      onBusyChange?.(false);
    }
  }

  return (
    <div className="grid gap-3">
      <Label>Profile photo</Label>
      <div className="flex flex-wrap items-end gap-4">
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            aria-label={photo ? "Change profile photo" : "Upload profile photo"}
            className={cn(
              "group relative grid size-20 place-items-center overflow-hidden bg-muted ring-1 ring-border transition-colors hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              profilePhotoShapeClass(shape),
            )}
          >
            {photo ? (
              <img src={photo} alt="" className="size-full object-cover" />
            ) : (
              <CameraIcon className="size-5 text-muted-foreground" />
            )}
            <span className="absolute inset-0 grid place-items-center bg-black/45 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <CameraIcon className="size-5" />
            </span>
          </button>
          {photo ? (
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              disabled={disabled}
              className="absolute -top-1.5 -right-1.5 rounded-full bg-background"
              aria-label="Remove profile photo"
              onClick={onPhotoClear}
            >
              <XIcon className="size-3" />
            </Button>
          ) : null}
        </div>

        <div className="grid gap-2">
          <p className="text-xs text-muted-foreground">Shape</p>
          <div className="flex gap-1.5" role="group" aria-label="Photo shape">
            {profilePhotoShapes.map((option) => {
              const meta = shapeMeta[option];
              const Icon = meta.icon;
              const active = shape === option;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={disabled}
                  aria-label={meta.label}
                  aria-pressed={active}
                  title={meta.label}
                  onClick={() => onShapeChange(option)}
                  className={cn(
                    "grid size-9 place-items-center rounded-md border transition-colors",
                    active
                      ? "border-foreground bg-muted text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    disabled && "pointer-events-none opacity-50",
                  )}
                >
                  <Icon className="size-4" />
                </button>
              );
            })}
          </div>
        </div>
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
    </div>
  );
}
