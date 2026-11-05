"use client";

import { removeProjectAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function DeleteProjectButton({ id }: { id: number }) {
  return (
    <form
      action={removeProjectAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this project?")) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  );
}
