import type { SiteProfile, StoredProject, StoredSkill, TimelineEntry } from "@/db";

export type ResumeDraft = {
  profile: SiteProfile;
  experience: TimelineEntry[];
  education: TimelineEntry[];
  certificates: TimelineEntry[];
  skills: StoredSkill[];
  projects: StoredProject[];
};

export type ResumeTab =
  | "profile"
  | "experience"
  | "education"
  | "certificates"
  | "skills"
  | "projects";

export const resumeTabs: ResumeTab[] = [
  "profile",
  "experience",
  "education",
  "certificates",
  "skills",
  "projects",
];

export function parseResumeTab(value: string | undefined): ResumeTab {
  if (value && resumeTabs.includes(value as ResumeTab)) return value as ResumeTab;
  return "profile";
}

/** Preview anchor keys matching `data-resume-key` on resume sections. */
export const resumePreviewSectionByTab: Record<ResumeTab, string> = {
  profile: "header",
  experience: "section-experience",
  education: "section-education",
  certificates: "section-certificates",
  skills: "section-skills",
  projects: "section-projects",
};

export function nextTempId(items: { id: number }[]) {
  const min = items.reduce((acc, item) => Math.min(acc, item.id), 0);
  return Math.min(min, 0) - 1;
}
