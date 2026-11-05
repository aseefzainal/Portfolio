"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import type { StoredProject } from "@/db";

const fieldClass =
  "rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-normal dark:border-white/15 dark:bg-stone-950";

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
      <label className="grid gap-2 text-sm font-medium">
        Title
        <input name="title" required defaultValue={project?.title ?? ""} className={`h-10 ${fieldClass}`} />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Description
        <textarea
          name="description"
          required
          rows={5}
          defaultValue={project?.description ?? ""}
          className={fieldClass}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Stack
        <input
          name="stack"
          defaultValue={project?.stack.join(", ") ?? ""}
          placeholder="Laravel, MySQL"
          className={`h-10 ${fieldClass}`}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Live URL
        <input
          name="href"
          type="url"
          defaultValue={project?.href ?? ""}
          placeholder="https://"
          className={`h-10 ${fieldClass}`}
        />
      </label>
      <label className="grid gap-2 text-sm font-medium">
        Repo URL
        <input
          name="repo"
          type="url"
          defaultValue={project?.repo ?? ""}
          placeholder="https://"
          className={`h-10 ${fieldClass}`}
        />
      </label>
      {state.error ? <p className="text-sm text-red-700 dark:text-red-300">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="h-10 w-fit rounded-md bg-teal-800 px-4 text-sm font-medium text-white disabled:opacity-60 dark:bg-teal-300 dark:text-stone-950"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
