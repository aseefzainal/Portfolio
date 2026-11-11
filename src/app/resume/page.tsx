import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ResumePreview } from "@/components/admin/resume/ResumePreview";
import type { ResumeDraft } from "@/components/admin/resume/types";
import { HeaderEffect } from "@/components/ClientEffects";
import { Logo } from "@/components/Logo";
import { ResumeDownloadButton } from "@/components/resume/ResumeDownloadButton";
import { Skeleton } from "@/components/ui/skeleton";
import { profile as fallbackProfile } from "@/data/profile";
import { getSiteProfile, listProjects, listSkills, listTimelineEntries } from "@/db";
import { io } from "next/cache";

export const metadata: Metadata = {
  title: `${fallbackProfile.name} · Resume`,
  description: `Resume for ${fallbackProfile.name}.`,
};

async function ResumeContent() {
  await io();
  const [profile, experience, education, certificates, skills, projects] = await Promise.all([
    getSiteProfile(),
    listTimelineEntries("work"),
    listTimelineEntries("education"),
    listTimelineEntries("certificate"),
    listSkills(),
    listProjects(),
  ]);

  const draft: ResumeDraft = {
    profile,
    experience,
    education,
    certificates,
    skills,
    projects,
  };

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
            {profile.resumePublished ? (
              <ResumeDownloadButton
                filename={`${profile.name.split(" ")[0] || "resume"}-resume.pdf`}
              />
            ) : null}
          </div>

          {profile.resumePublished ? (
            <ResumePreview draft={draft} />
          ) : (
            <div className="rounded-sm border border-border bg-muted/30 px-6 py-16 text-center">
              <p className="text-sm font-medium">Resume is not published yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                The public resume page will show the studio version once it is published from admin.
              </p>
              <Link
                href="/"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
              >
                Back to home
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function ResumePageSkeleton() {
  return (
    <main className="px-5 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-[210mm]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <Skeleton className="aspect-[210/297] w-full rounded-sm" />
      </div>
    </main>
  );
}

export default function ResumePage() {
  return (
    <Suspense fallback={<ResumePageSkeleton />}>
      <ResumeContent />
    </Suspense>
  );
}
