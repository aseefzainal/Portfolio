import { signOut } from "@/auth";
import { auth } from "@/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminNav } from "@/components/admin/AdminNav";
import { getSiteProfile } from "@/db";
import { io } from "next/cache";
import { redirect } from "next/navigation";

async function logoutAction() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await io();
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await getSiteProfile();

  return (
    <div className="min-h-dvh bg-background md:flex">
      <aside className="border-b border-border md:sticky md:top-0 md:flex md:h-dvh md:w-56 md:shrink-0 md:flex-col md:border-r md:border-b-0">
        <div className="flex flex-col gap-4 px-4 py-4 md:h-full md:px-3 md:py-6">
          <div className="min-w-0 md:px-2">
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Admin</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">Portfolio CMS</p>
          </div>

          <AdminNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          name={profile.name}
          email={session.user.email ?? profile.email}
          photo={profile.photo}
          photoShape={profile.photoShape}
          logoutAction={logoutAction}
        />
        <main className="min-w-0 flex-1 px-5 py-8 md:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
