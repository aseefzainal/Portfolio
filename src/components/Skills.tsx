import { SectionTitle } from "@/components/SectionTitle";
import {
  siGit,
  siJavascript,
  siLaravel,
  siMysql,
  siNextdotjs,
  siPhp,
  siReact,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

const skills: { name: string; icon: SimpleIcon; color?: string }[] = [
  { name: "Laravel", icon: siLaravel, color: "#FF2D20" },
  { name: "PHP", icon: siPhp, color: "#777BB4" },
  { name: "MySQL", icon: siMysql, color: "#4479A1" },
  { name: "JavaScript", icon: siJavascript, color: "#F7DF1E" },
  { name: "TypeScript", icon: siTypescript, color: "#3178C6" },
  { name: "React", icon: siReact, color: "#61DAFB" },
  { name: "Next.js", icon: siNextdotjs },
  { name: "Tailwind", icon: siTailwindcss, color: "#06B6D4" },
  { name: "Git", icon: siGit, color: "#F05032" },
];

export function Skills() {
  return (
    <section id="skills" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Stack" title="Skills" />
        <ul className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill.name}
              data-reveal
              className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={skill.color ? "size-4" : "size-4 text-foreground"}
                style={skill.color ? { color: skill.color } : undefined}
              >
                <path fill="currentColor" d={skill.icon.path} />
              </svg>
              {skill.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
