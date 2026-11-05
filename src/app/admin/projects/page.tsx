import Link from "next/link";
import { Suspense } from "react";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listProjects } from "@/db";
import { cn } from "@/lib/utils";
import { io } from "next/cache";

async function ProjectTable() {
  await io();
  const projects = await listProjects();

  return (
    <>
      <div className="flex justify-end">
        <Link href="/admin/projects/new" className={cn(buttonVariants(), "h-10")}>
          Add project
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No projects yet.</p>
      ) : (
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Stack</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.stack.map((item) => (
                        <Badge key={item} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
                      >
                        Edit
                      </Link>
                      <DeleteProjectButton id={project.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

export default function AdminProjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-2 text-sm text-muted-foreground">Portfolio projects on the homepage.</p>
      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading projects…</p>}>
          <ProjectTable />
        </Suspense>
      </div>
    </div>
  );
}
