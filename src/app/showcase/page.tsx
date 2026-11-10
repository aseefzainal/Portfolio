import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell";
import { ShowcasePageSkeleton } from "@/components/LoadingSkeletons";
import { listShowcaseTools } from "@/db";
import { io } from "next/cache";

export const metadata: Metadata = {
  title: "Showcase",
  description: "Small browser tools — PDF merge, split, and more.",
};

async function ShowcaseContent() {
  await io();
  const tools = await listShowcaseTools({ enabled: true });

  return (
    <ShowcaseShell>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Showcase</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        Simple utilities that run in your browser. Start with PDF tools — more projects can land
        here later.
      </p>
      {tools.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No showcase tools are available right now.</p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={tool.href}
                className="block h-full rounded-md border px-5 py-5 transition-colors hover:bg-accent/40"
              >
                <h2 className="font-medium">{tool.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </ShowcaseShell>
  );
}

export default function ShowcasePage() {
  return (
    <Suspense fallback={<ShowcasePageSkeleton />}>
      <ShowcaseContent />
    </Suspense>
  );
}
