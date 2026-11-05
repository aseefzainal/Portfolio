"use client";

import { useActionState } from "react";
import { saveProfile, type ProfileFormState } from "@/app/admin/profile/actions";
import type { SiteProfile } from "@/db";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initial: ProfileFormState = { error: "", message: "" };

export function ProfileForm({ profile }: { profile: SiteProfile }) {
  const [state, action, pending] = useActionState(saveProfile, initial);

  return (
    <form action={action} className="grid max-w-xl gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required defaultValue={profile.name} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" name="role" required defaultValue={profile.role} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" required rows={4} defaultValue={profile.summary} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" required defaultValue={profile.location} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required defaultValue={profile.email} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="github">GitHub URL</Label>
        <Input id="github" name="github" type="url" defaultValue={profile.github} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input id="linkedin" name="linkedin" type="url" defaultValue={profile.linkedin} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="resume">Resume path</Label>
        <Input id="resume" name="resume" required defaultValue={profile.resume} className="h-10" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="githubUsername">GitHub username</Label>
        <Input
          id="githubUsername"
          name="githubUsername"
          required
          defaultValue={profile.githubUsername}
          className="h-10"
        />
      </div>
      {state.error ? (
        <Alert variant="destructive">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state.message ? (
        <Alert>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      <Button type="submit" disabled={pending} className="h-10 w-fit">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
