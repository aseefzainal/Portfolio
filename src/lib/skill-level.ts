export const skillLevels = ["advanced", "proficient", "familiar"] as const;

export type SkillLevel = (typeof skillLevels)[number];

export const skillLevelLabels: Record<SkillLevel, string> = {
  advanced: "Advanced",
  proficient: "Proficient",
  familiar: "Familiar",
};

export function parseSkillLevel(value: string | null | undefined): SkillLevel {
  if (value === "advanced" || value === "familiar") return value;
  return "proficient";
}

export function isSkillLevel(value: string): value is SkillLevel {
  return (skillLevels as readonly string[]).includes(value);
}

/** Homepage / dark UI pill classes matching the reference legend. */
export function skillLevelPillClass(level: SkillLevel) {
  switch (level) {
    case "advanced":
      return "border-sky-500/70 text-sky-400";
    case "familiar":
      return "border-muted-foreground/25 text-muted-foreground/70";
    default:
      return "border-foreground/35 text-foreground";
  }
}

export function skillLevelDotClass(level: SkillLevel) {
  switch (level) {
    case "advanced":
      return "bg-sky-400";
    case "familiar":
      return "bg-muted-foreground/50";
    default:
      return "bg-foreground";
  }
}

/** Resume (light paper) pill classes. */
export function skillLevelResumePillClass(level: SkillLevel) {
  switch (level) {
    case "advanced":
      return "border-sky-600 text-sky-700";
    case "familiar":
      return "border-neutral-300 text-neutral-400";
    default:
      return "border-neutral-500 text-neutral-800";
  }
}
