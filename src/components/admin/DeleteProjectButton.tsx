"use client";

import { removeProjectAction } from "@/app/admin/actions";

export function DeleteProjectButton({ id }: { id: number }) {
  return (
    <form
      action={removeProjectAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this project?")) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm font-medium text-red-700 hover:underline dark:text-red-300">
        Delete
      </button>
    </form>
  );
}
