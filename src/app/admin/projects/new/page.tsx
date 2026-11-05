import Link from "next/link";
import { createProject } from "@/app/admin/actions";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/admin/projects" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Back to projects
      </Link>
      <h2 className="mt-4 text-lg font-semibold">Add project</h2>
      <div className="mt-6">
        <ProjectForm action={createProject} submitLabel="Add project" />
      </div>
    </div>
  );
}
