"use client";

import { useActionState, useState } from "react";
import { saveProfile, type ProfileFormState } from "@/app/admin/profile/actions";
import type { SiteProfile } from "@/db";
import { ProfilePhotoField } from "@/components/admin/ProfilePhotoField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { parseProfilePhotoShape, type ProfilePhotoShape } from "@/lib/profile-photo";

const initial: ProfileFormState = { error: "", message: "" };

export function ProfileForm({ profile }: { profile: SiteProfile }) {
  const [state, action, pending] = useActionState(saveProfile, initial);
  const [photo, setPhoto] = useState(profile.photo ?? "");
  const [photoShape, setPhotoShape] = useState<ProfilePhotoShape>(
    parseProfilePhotoShape(profile.photoShape),
  );
  const [photoError, setPhotoError] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);

  return (
    <form action={action} className="grid max-w-xl gap-4">
      <input type="hidden" name="photo" value={photo} />
      <input type="hidden" name="photoShape" value={photoShape} />
      <div className="grid gap-2">
        <ProfilePhotoField
          photo={photo}
          photoShape={photoShape}
          disabled={photoBusy || pending}
          onPhotoChange={setPhoto}
          onPhotoClear={() => setPhoto("")}
          onShapeChange={setPhotoShape}
          onError={setPhotoError}
          onBusyChange={setPhotoBusy}
        />
        {photoBusy ? <p className="text-sm text-muted-foreground">Compressing photo…</p> : null}
        {photoError ? (
          <Alert variant="destructive">
            <AlertDescription>{photoError}</AlertDescription>
          </Alert>
        ) : null}
      </div>
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
      <Button type="submit" disabled={pending || photoBusy} className="h-10 w-fit">
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
