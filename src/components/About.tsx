import { profile } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="px-5 py-16 sm:py-20">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[12rem_1fr]">
        <h2 className="text-sm font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">
          About
        </h2>
        <div className="space-y-4 text-lg leading-8 text-stone-700 dark:text-stone-300">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
