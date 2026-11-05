import type { TimelineKind } from "@/db/schema";

export type TimelineSection = {
  kind: TimelineKind;
  href: string;
  label: string;
  singular: string;
  description: string;
  placeLabel: string;
  showCredentialUrl: boolean;
};

export const timelineSections: Record<TimelineKind, TimelineSection> = {
  work: {
    kind: "work",
    href: "/admin/experience",
    label: "Experience",
    singular: "role",
    description: "Work history on the homepage.",
    placeLabel: "Company / place",
    showCredentialUrl: false,
  },
  education: {
    kind: "education",
    href: "/admin/education",
    label: "Education",
    singular: "entry",
    description: "Education history on the homepage.",
    placeLabel: "School / institution",
    showCredentialUrl: false,
  },
  certificate: {
    kind: "certificate",
    href: "/admin/certificates",
    label: "Certificates",
    singular: "certificate",
    description: "Licenses and certificates on the homepage.",
    placeLabel: "Issuer",
    showCredentialUrl: true,
  },
};

export function sectionForKind(kind: TimelineKind): TimelineSection {
  return timelineSections[kind];
}

export function pathForKind(kind: TimelineKind): string {
  return timelineSections[kind].href;
}
