import { profile } from "@/data/profile";

export function Hero() {
  return (
    <section id="top" className="border-b border-stone-200 px-5 py-20 dark:border-white/10 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium tracking-wide text-teal-700 dark:text-teal-300">
          {profile.location}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {profile.name}
        </h1>
        <p className="mt-4 text-xl text-stone-700 dark:text-stone-300">{profile.role}</p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600 dark:text-stone-400">
          {profile.summary}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full bg-teal-800 px-5 text-sm font-medium text-white hover:bg-teal-700"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 px-5 text-sm font-medium hover:border-teal-700 hover:text-teal-800 dark:border-white/20 dark:hover:border-teal-300 dark:hover:text-teal-200"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
