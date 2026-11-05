import { Suspense } from "react";
import { PublishResumeButton } from "@/components/admin/resume/PublishResumeButton";
import { ResumeStudio } from "@/components/admin/resume/ResumeStudio";
import { parseResumeTab, type ResumeDraft } from "@/components/admin/resume/types";
import { ResumeStudioSkeleton } from "@/components/LoadingSkeletons";
import { getSiteProfile, listProjects, listSkills, listTimelineEntries } from "@/db";
import { io } from "next/cache";

async function ResumeStudioLoader({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await io();
  const { tab } = await searchParams;
  const [profile, experience, education, certificates, skills, projects] = await Promise.all([
    getSiteProfile(),
    listTimelineEntries("work"),
    listTimelineEntries("education"),
    listTimelineEntries("certificate"),
    listSkills(),
    listProjects(),
  ]);

  const initial: ResumeDraft = {
    profile,
    experience,
    education,
    certificates,
    skills,
    projects,
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit profile, experience, education, certificates, skills, and projects here. When it
            looks right, publish it to the public resume page.
          </p>
        </div>
        <PublishResumeButton initiallyPublished={profile.resumePublished} />
      </div>
      <div className="mt-6">
        <ResumeStudio initial={initial} initialTab={parseResumeTab(tab)} />
      </div>
    </div>
  );
}

export default function AdminResumePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  return (
    <Suspense fallback={<ResumeStudioSkeleton />}>
      <ResumeStudioLoader searchParams={searchParams} />
    </Suspense>
  );
}
