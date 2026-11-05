"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/admin";
import type { TimelineEntry } from "@/db";
import type { TimelineKind } from "@/db/schema";
import { sectionForKind } from "@/lib/timeline-admin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TimelineForm({
  action,
  kind,
  entry,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  kind: TimelineKind;
  entry?: TimelineEntry;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });
  const section = sectionForKind(kind);

  return (
    <form action={formAction} className="grid max-w-xl gap-4">
      {entry ? <input type="hidden" name="id" value={entry.id} /> : null}
      <input type="hidden" name="kind" value={kind} />
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={entry?.title ?? ""} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="place">{section.placeLabel}</Label>
        <Input id="place" name="place" required defaultValue={entry?.place ?? ""} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="period">Period</Label>
        <Input id="period" name="period" required defaultValue={entry?.period ?? ""} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="detail">Detail</Label>
        <Textarea id="detail" name="detail" required rows={4} defaultValue={entry?.detail ?? ""} />
      </div>
      {section.showCredentialUrl ? (
        <div className="grid gap-2">
          <Label htmlFor="href">Credential URL</Label>
          <Input
            id="href"
            name="href"
            type="url"
            defaultValue={entry?.href ?? ""}
            placeholder="https://"
            className="h-10"
          />
        </div>
      ) : null}
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
