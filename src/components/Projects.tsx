import { SectionTitle } from "@/components/SectionTitle";
import { profile, type Project } from "@/data/profile";

export function Projects() {
  return (
    <section id="projects" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Selected work" title="Projects" />
        <ul className="mt-2">
          {(profile.projects as Project[]).map((project) => (
            <li key={project.title} data-reveal className="flex gap-4 border-b py-6">
              {project.image ? (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-md border bg-white p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.image} alt="" className="max-h-full max-w-full object-contain" />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-xs text-muted-foreground">{project.stack.join(" · ")}</p>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{project.description}</p>
                {project.href || project.repo ? (
                  <div className="mt-3 flex gap-4 text-sm font-medium">
                    {project.href ? (
                      <a href={project.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                        Live
                      </a>
                    ) : null}
                    {project.repo ? (
                      <a href={project.repo} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                        Repo
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
