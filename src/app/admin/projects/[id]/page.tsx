import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveProject } from "@/app/admin/actions";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getProject } from "@/db";
import { io } from "next/cache";

async function EditProject({ id }: { id: string }) {
  await io();
  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId < 1) notFound();
  const project = await getProject(projectId);
  if (!project) notFound();

  return (
    <div>
      <Link href="/admin/projects" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Back to projects
      </Link>
      <h2 className="mt-4 text-lg font-semibold">Edit project</h2>
      <div className="mt-6">
        <ProjectForm action={saveProject} project={project} submitLabel="Save changes" />
      </div>
    </div>
  );
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading project…</p>}>
      <EditProject id={id} />
    </Suspense>
  );
}
