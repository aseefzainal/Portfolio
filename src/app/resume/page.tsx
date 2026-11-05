import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { HeaderEffect } from "@/components/ClientEffects";
import { ResumeEffect } from "@/components/ResumeEffect";
import { profile } from "@/data/profile";

const fileName = "Aseef-Zainal-Resume.pdf";

export const metadata: Metadata = {
  title: `${profile.name} · Resume`,
  description: `Resume for ${profile.name}.`,
};

export default function ResumePage() {
  return (
    <>
      <header data-header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-sm font-medium">
            <Logo className="h-5 w-auto" />
            <span>{profile.name.split(" ")[0]}</span>
          </Link>
          <button
            type="button"
            data-theme-toggle
            aria-pressed="false"
            className="inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-medium"
          >
            Dark
          </button>
        </div>
        <HeaderEffect />
      </header>
      <main className="px-5 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-[210mm]">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Resume</p>
            <a
              href={profile.resume}
              download={fileName}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Download PDF
            </a>
          </div>
          <div
            data-sheet
            data-src={profile.resume}
            className="relative aspect-[210/297] w-full overflow-hidden bg-white shadow-[0_18px_50px_rgb(0_0_0/0.14)] ring-1 ring-black/10 dark:ring-white/15"
          >
            <canvas className="h-full w-full object-contain" aria-label={`${profile.name} resume`} />
            <p
              data-resume-fallback
              hidden
              className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-neutral-600"
            >
              The preview could not be shown.{" "}
              <a href={profile.resume} className="font-medium text-neutral-900 underline underline-offset-4">
                Open the PDF
              </a>
            </p>
            <ResumeEffect />
          </div>
        </div>
      </main>
    </>
  );
}
