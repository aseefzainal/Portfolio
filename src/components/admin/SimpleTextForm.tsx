"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/admin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ParagraphEditForm({
  id,
  body,
  action,
}: {
  id: number;
  body: string;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="grid max-w-xl gap-4">
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-2">
        <Label htmlFor="body">Paragraph</Label>
        <Textarea id="body" name="body" required rows={6} defaultValue={body} />
      </div>
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} className="h-10 w-fit">
        {pending ? "Saving…" : "Save paragraph"}
      </Button>
    </form>
  );
}

export function FactEditForm({
  id,
  title,
  text,
  action,
}: {
  id: number;
  title: string;
  text: string;
  action: (state: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="grid max-w-xl gap-4">
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={title} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="text">Text</Label>
        <Input id="text" name="text" required defaultValue={text} className="h-10" />
      </div>
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} className="h-10 w-fit">
        {pending ? "Saving…" : "Save fact"}
      </Button>
    </form>
  );
}
