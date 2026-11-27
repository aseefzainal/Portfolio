import { SectionTitle } from "@/components/SectionTitle";
import { getSiteProfile, listSkills } from "@/db";
import { groupSkillsByCategory } from "@/lib/skill-categories";
import { resolveSkillIcon } from "@/lib/skill-icons";
import {
  skillLevelDotClass,
  skillLevelLabels,
  skillLevelPillClass,
  skillLevels,
} from "@/lib/skill-level";
import { cn } from "@/lib/utils";
import { io } from "next/cache";

export async function Skills() {
  await io();
  const profile = await getSiteProfile();
  if (!profile.sections.skills.site) return null;
  const skills = await listSkills();
  const groups = groupSkillsByCategory(skills);

  return (
    <section id="skills" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Stack" title="Skills" />
        {skills.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">No skills yet.</p>
        ) : (
          <>
            <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {skillLevels.map((level) => (
                <li key={level} className="inline-flex items-center gap-2 text-muted-foreground">
                  <span className={cn("size-2 rounded-full", skillLevelDotClass(level))} />
                  <span
                    className={cn(
                      level === "advanced" && "text-sky-400",
                      level === "proficient" && "text-foreground",
                      level === "familiar" && "text-muted-foreground/70",
                    )}
                  >
                    {skillLevelLabels[level]}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {groups.map((group) => (
                <div key={group.category} data-reveal>
                  <h3 className="text-sm font-semibold tracking-tight">{group.category}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((skill) => {
                      const icon = resolveSkillIcon(skill.iconSlug);
                      return (
                        <li
                          key={skill.id}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm",
                            skillLevelPillClass(skill.level),
                          )}
                        >
                          {icon ? (
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="size-4"
                              style={skill.color ? { color: skill.color } : undefined}
                            >
                              <path fill="currentColor" d={icon.path} />
                            </svg>
                          ) : null}
                          {skill.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
