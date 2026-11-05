import Link from "next/link";
import { Suspense } from "react";
import { removeSkillAction } from "@/app/admin/skills/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
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
import { listSkills } from "@/db";
import { cn } from "@/lib/utils";
import { io } from "next/cache";

async function SkillsTable() {
  await io();
  const skills = await listSkills();

  return (
    <>
      <div className="flex justify-end">
        <Link href="/admin/skills/new" className={cn(buttonVariants(), "h-10")}>
          Add skill
        </Link>
      </div>
      {skills.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No skills yet.</p>
      ) : (
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.name}</TableCell>
                  <TableCell>
                    {skill.iconSlug ? (
                      <Badge variant="secondary">{skill.iconSlug}</Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{skill.color || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/skills/${skill.id}`}
                        className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
                      >
                        Edit
                      </Link>
                      <DeleteButton id={skill.id} action={removeSkillAction} />
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

export default function AdminSkillsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Skills</h1>
      <p className="mt-2 text-sm text-muted-foreground">Stack chips on the homepage.</p>
      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading skills…</p>}>
          <SkillsTable />
        </Suspense>
      </div>
    </div>
  );
}
