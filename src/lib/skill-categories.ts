export const skillCategoryPresets = [
  "Backend",
  "Framework",
  "Languages",
  "Databases",
  "Web",
  "Mobile",
  "Infrastructure",
  "AI",
  "Tooling",
] as const;

export type SkillCategoryPreset = (typeof skillCategoryPresets)[number];

export function normalizeSkillCategory(value: string | null | undefined) {
  return String(value ?? "").trim();
}

/** Group skills by category; blank categories sort last as "Other". */
export function groupSkillsByCategory<T extends { category: string; position: number; id: number }>(
  skills: T[],
) {
  const map = new Map<string, T[]>();
  for (const skill of skills) {
    const key = normalizeSkillCategory(skill.category) || "Other";
    const list = map.get(key) ?? [];
    list.push(skill);
    map.set(key, list);
  }

  const presetOrder = new Map(skillCategoryPresets.map((name, index) => [name, index]));
  return [...map.entries()]
    .sort(([a], [b]) => {
      if (a === "Other") return 1;
      if (b === "Other") return -1;
      const ai = presetOrder.get(a as SkillCategoryPreset);
      const bi = presetOrder.get(b as SkillCategoryPreset);
      if (ai !== undefined && bi !== undefined) return ai - bi;
      if (ai !== undefined) return -1;
      if (bi !== undefined) return 1;
      return a.localeCompare(b);
    })
    .map(([category, items]) => ({
      category,
      items: [...items].sort((x, y) => x.position - y.position || x.id - y.id),
    }));
}
