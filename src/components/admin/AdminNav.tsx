"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", match: (path: string) => path === "/admin" },
  {
    href: "/admin/resume",
    label: "Resume",
    match: (path: string) => path === "/admin/resume" || path.startsWith("/admin/resume/"),
  },
  {
    href: "/admin/about",
    label: "About",
    match: (path: string) => path === "/admin/about" || path.startsWith("/admin/about/"),
  },
  {
    href: "/admin/showcase",
    label: "Showcase",
    match: (path: string) => path === "/admin/showcase" || path.startsWith("/admin/showcase/"),
  },
];

export function AdminNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex gap-1 overflow-x-auto md:flex-col md:overflow-visible", className)}>
      {links.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-md px-2.5 py-2 text-sm font-medium transition-colors md:shrink",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
