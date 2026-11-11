import { SectionTitle } from "@/components/SectionTitle";
import { getSiteProfile, listSkills } from "@/db";
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
            <ul className="mt-5 flex flex-wrap gap-2">
              {skills.map((skill) => {
                const icon = resolveSkillIcon(skill.iconSlug);
                return (
                  <li
                    key={skill.id}
                    data-reveal
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm",
                      skillLevelPillClass(skill.level),
                    )}
                  >
                    {icon ? (
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className={skill.color ? "size-4" : "size-4"}
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
          </>
        )}
      </div>
    </section>
  );
}
