import { signOut } from "@/auth";
import { auth } from "@/auth";
import { io } from "next/cache";
import { redirect } from "next/navigation";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await io();
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-4 dark:border-white/10">
          <div>
            <p className="text-sm font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">Admin</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Projects</h1>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="h-9 rounded-md border border-stone-300 px-3 text-sm font-medium dark:border-white/15"
            >
              Log out
            </button>
          </form>
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
