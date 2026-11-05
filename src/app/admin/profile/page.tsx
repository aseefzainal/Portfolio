import { Suspense } from "react";
import { ProfileForm } from "@/components/admin/ProfileForm";
import { getSiteProfile } from "@/db";
import { io } from "next/cache";

async function ProfileEditor() {
  await io();
  const profile = await getSiteProfile();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Used by the hero, header, footer, contact links, and contributions chart.
      </p>
      <div className="mt-6">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading profile…</p>}>
      <ProfileEditor />
    </Suspense>
  );
}
