import Link from "next/link";
import { signOut } from "@/auth";
import { auth } from "@/auth";
import { io } from "next/cache";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/about", label: "About" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/certificates", label: "Certificates" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
];

export async function AdminShell({ children }: { children: React.ReactNode }) {
  await io();
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="bg-background px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Admin</p>
            <nav className="mt-2 flex flex-wrap gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button type="submit" variant="outline" size="sm">
              Log out
            </Button>
          </form>
        </div>
        <Separator className="my-6" />
        <div>{children}</div>
      </div>
    </div>
  );
}
