import { SectionTitle } from "@/components/SectionTitle";
import { listSkills } from "@/db";
import { resolveSkillIcon } from "@/lib/skill-icons";
import { io } from "next/cache";

export async function Skills() {
  await io();
  const skills = await listSkills();

  return (
    <section id="skills" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Stack" title="Skills" />
        {skills.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">No skills yet.</p>
        ) : (
          <ul className="mt-6 flex flex-wrap gap-2">
            {skills.map((skill) => {
              const icon = resolveSkillIcon(skill.iconSlug);
              return (
                <li
                  key={skill.id}
                  data-reveal
                  className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"
                >
                  {icon ? (
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={skill.color ? "size-4" : "size-4 text-foreground"}
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
        )}
      </div>
    </section>
  );
}
