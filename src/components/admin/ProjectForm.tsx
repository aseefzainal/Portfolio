"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/admin";
import type { StoredProject } from "@/db";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  project?: StoredProject;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="grid max-w-xl gap-4">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={project?.title ?? ""} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={5}
          defaultValue={project?.description ?? ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="stack">Stack</Label>
        <Input
          id="stack"
          name="stack"
          defaultValue={project?.stack.join(", ") ?? ""}
          placeholder="Laravel, MySQL"
          className="h-10"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Image path</Label>
        <Input
          id="image"
          name="image"
          defaultValue={project?.image ?? ""}
          placeholder="/projects/example.png"
          className="h-10"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="mark">Mark</Label>
        <Input id="mark" name="mark" defaultValue={project?.mark ?? ""} placeholder="ILMS" className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="href">Live URL</Label>
        <Input
          id="href"
          name="href"
          type="url"
          defaultValue={project?.href ?? ""}
          placeholder="https://"
          className="h-10"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="repo">Repo URL</Label>
        <Input
          id="repo"
          name="repo"
          type="url"
          defaultValue={project?.repo ?? ""}
          placeholder="https://"
          className="h-10"
        />
      </div>
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} className="h-10 w-fit">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
