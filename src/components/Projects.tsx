import { listProjects } from "@/db";
import { io } from "next/cache";

export async function Projects() {
  await io();
  const projects = await listProjects();

  return (
    <section id="projects" className="border-y border-stone-200 px-5 py-16 dark:border-white/10 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-sm font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">Projects</h2>
        {projects.length === 0 ? (
          <p className="mt-8 text-sm text-stone-600 dark:text-stone-400">No projects yet.</p>
        ) : (
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex flex-col rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-white/5"
              >
                <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-stone-600 dark:text-stone-400">{project.description}</p>
                {project.stack.length > 0 ? (
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-700 dark:bg-white/10 dark:text-stone-200"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {project.href || project.repo ? (
                  <div className="mt-5 flex gap-4 text-sm font-medium">
                    {project.href ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-800 hover:underline dark:text-teal-300"
                      >
                        Live
                      </a>
                    ) : null}
                    {project.repo ? (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-800 hover:underline dark:text-teal-300"
                      >
                        Repo
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
