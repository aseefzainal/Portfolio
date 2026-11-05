import { Suspense } from "react";
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
      <h1 className="text-2xl font-semibold tracking-tight">Resume</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Edit profile, experience, education, certificates, skills, and projects here. Toggle what
        appears on the homepage vs the resume. The preview updates as you type.
      </p>
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
