import type { Metadata } from "next";
import { Suspense } from "react";
import { MergePdfTool } from "@/components/showcase/MergePdfTool";
import { ShowcaseGate } from "@/components/showcase/ShowcaseGate";
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell";
import { ShowcasePageSkeleton } from "@/components/LoadingSkeletons";

export const metadata: Metadata = {
  title: "Merge PDF · Showcase",
  description: "Combine multiple PDF files into one, entirely in your browser.",
};

export default function MergePdfPage() {
  return (
    <Suspense fallback={<ShowcasePageSkeleton />}>
      <ShowcaseGate slug="merge-pdf" title="Merge PDF">
        <ShowcaseShell title="Merge PDF">
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Merge PDF</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Add two or more PDFs, reorder them, then download a single merged file. Nothing is sent to
            a server.
          </p>
          <MergePdfTool />
        </ShowcaseShell>
      </ShowcaseGate>
    </Suspense>
  );
}
