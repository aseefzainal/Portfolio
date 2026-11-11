import Link from "next/link";
import type { ReactNode } from "react";
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell";
import { getShowcaseToolBySlug } from "@/db";
import { io } from "next/cache";

export async function ShowcaseGate({
  slug,
  title,
  children,
}: {
  slug: string;
  title: string;
  children: ReactNode;
}) {
  await io();
  const tool = await getShowcaseToolBySlug(slug);

  if (!tool || !tool.enabled) {
    return (
      <ShowcaseShell title={title}>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          This tool is not available right now.
        </p>
        <Link
          href="/showcase"
          className="mt-8 inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
        >
          Back to Showcase
        </Link>
      </ShowcaseShell>
    );
  }

  return children;
}
