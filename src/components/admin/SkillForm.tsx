"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/admin";
import type { StoredSkill } from "@/db";
import { skillIconOptions } from "@/lib/skill-icons";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SkillForm({
  action,
  skill,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  skill?: StoredSkill;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: "" });

  return (
    <form action={formAction} className="grid max-w-xl gap-4">
      {skill ? <input type="hidden" name="id" value={skill.id} /> : null}
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={skill?.name ?? ""} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="iconSlug">Icon</Label>
        <Select name="iconSlug" defaultValue={skill?.iconSlug || "__none__"}>
          <SelectTrigger id="iconSlug" className="h-10 w-full">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">None</SelectItem>
            {skillIconOptions.map((slug) => (
              <SelectItem key={slug} value={slug}>
                {slug}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          name="color"
          defaultValue={skill?.color ?? ""}
          placeholder="#61DAFB"
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
