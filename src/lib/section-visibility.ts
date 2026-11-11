export const sectionKeys = [
  "experience",
  "education",
  "certificates",
  "skills",
  "projects",
] as const;

export type SectionKey = (typeof sectionKeys)[number];

export type SectionFlags = {
  site: boolean;
  resume: boolean;
};

export type SectionVisibility = Record<SectionKey, SectionFlags>;

export const defaultSectionVisibility: SectionVisibility = {
  experience: { site: true, resume: true },
  education: { site: true, resume: true },
  certificates: { site: true, resume: true },
  skills: { site: true, resume: true },
  projects: { site: true, resume: true },
};

export function isSectionKey(value: string): value is SectionKey {
  return (sectionKeys as readonly string[]).includes(value);
}

export function parseSectionVisibility(raw: string | null | undefined): SectionVisibility {
  let parsed: unknown = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
  }

  const source =
    parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};

  const next = { ...defaultSectionVisibility };
  for (const key of sectionKeys) {
    const entry = source[key];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const flags = entry as Record<string, unknown>;
    next[key] = {
      site: flags.site === false ? false : true,
      resume: flags.resume === false ? false : true,
    };
  }
  return next;
}

export function serializeSectionVisibility(value: SectionVisibility) {
  return JSON.stringify(value);
}
