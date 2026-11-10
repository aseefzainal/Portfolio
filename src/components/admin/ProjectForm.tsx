"use client";

import { useActionState, useState } from "react";
import type { FormState } from "@/lib/admin";
import type { StoredProject } from "@/db";
import { ProjectImageField } from "@/components/admin/ProjectImageField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  const [image, setImage] = useState(project?.image ?? "");
  const [imageError, setImageError] = useState("");
  const [imageBusy, setImageBusy] = useState(false);

  return (
    <form
      action={(formData) => {
        formData.set("image", image);
        formAction(formData);
      }}
      className="grid max-w-xl gap-4"
    >
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
        <ProjectImageField
          image={image}
          disabled={imageBusy || pending}
          onImageChange={setImage}
          onImageClear={() => setImage("")}
          onError={setImageError}
          onBusyChange={setImageBusy}
        />
        {imageBusy ? <p className="text-sm text-muted-foreground">Compressing image…</p> : null}
        {imageError ? (
          <Alert variant="destructive">
            <AlertDescription>{imageError}</AlertDescription>
          </Alert>
        ) : null}
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
      <div className="grid gap-2">
        <Label className="font-normal">
          <Checkbox name="showOnSite" value="on" defaultChecked={project?.showOnSite ?? true} />
          Show on homepage
        </Label>
        <Label className="font-normal">
          <Checkbox name="showOnResume" value="on" defaultChecked={project?.showOnResume ?? true} />
          Show on resume
        </Label>
      </div>
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending || imageBusy} className="h-10 w-fit">
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
