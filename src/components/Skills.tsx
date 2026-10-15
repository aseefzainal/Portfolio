import { profile } from "@/data/profile";

export function Skills() {
  return (
    <section id="skills" className="px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-sm font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">
          Skills
        </h2>
        <ul className="mt-8 flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-stone-300 px-3 py-1.5 text-sm dark:border-white/15"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
