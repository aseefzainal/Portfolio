import Link from "next/link";
import { Suspense } from "react";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { listProjects } from "@/db";
import { io } from "next/cache";

async function ProjectTable() {
  await io();
  const projects = await listProjects();

  return (
    <>
      <div className="flex justify-end">
        <Link
          href="/admin/projects/new"
          className="inline-flex h-10 items-center rounded-md bg-teal-800 px-4 text-sm font-medium text-white dark:bg-teal-300 dark:text-stone-950"
        >
          Add project
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-stone-600 dark:text-stone-400">No projects yet.</p>
      ) : (
        <ul className="mt-6 divide-y divide-stone-200 dark:divide-white/10">
          {projects.map((project) => (
            <li key={project.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div>
                <h2 className="font-medium">{project.title}</h2>
                <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">{project.stack.join(" · ")}</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/projects/${project.id}`} className="text-sm font-medium text-teal-800 hover:underline dark:text-teal-300">
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function AdminProjectsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-stone-500">Loading projects…</p>}>
      <ProjectTable />
    </Suspense>
  );
}
