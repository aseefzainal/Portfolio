import Link from "next/link";
import type { ReactNode } from "react";
import { HeaderEffect } from "@/components/ClientEffects";
import { Logo } from "@/components/Logo";
import { getSiteProfile } from "@/db";
import { io } from "next/cache";

export async function ShowcaseShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  await io();
  const profile = await getSiteProfile();

  return (
    <>
      <header data-header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-5">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-sm font-medium">
            <Logo className="h-5 w-auto" />
            <span>{profile.name.split(" ")[0]}</span>
          </Link>
          <nav aria-label="Showcase" className="flex items-center gap-3 text-sm">
            <Link href="/showcase" className="text-muted-foreground hover:text-foreground">
              Showcase
            </Link>
            <button
              type="button"
              data-theme-toggle
              aria-pressed="false"
              className="inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-medium"
            >
              Dark
            </button>
          </nav>
        </div>
        <HeaderEffect />
      </header>
      <main className="px-5 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          {title ? (
            <p className="text-sm text-muted-foreground">
              <Link href="/showcase" className="hover:text-foreground">
                Showcase
              </Link>
              <span className="mx-2">/</span>
              <span>{title}</span>
            </p>
          ) : null}
          {children}
        </div>
      </main>
    </>
  );
}
