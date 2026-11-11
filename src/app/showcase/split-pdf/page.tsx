import type { Metadata } from "next";
import { Suspense } from "react";
import { SplitPdfTool } from "@/components/showcase/SplitPdfTool";
import { ShowcaseGate } from "@/components/showcase/ShowcaseGate";
import { ShowcaseShell } from "@/components/showcase/ShowcaseShell";
import { ShowcasePageSkeleton } from "@/components/LoadingSkeletons";

export const metadata: Metadata = {
  title: "Split PDF · Showcase",
  description: "Extract pages from a PDF in your browser.",
};

export default function SplitPdfPage() {
  return (
    <Suspense fallback={<ShowcasePageSkeleton />}>
      <ShowcaseGate slug="split-pdf" title="Split PDF">
        <ShowcaseShell title="Split PDF">
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Split PDF</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Upload a PDF, tick the pages to keep, then download a new file. Unticked pages are removed.
          </p>
          <SplitPdfTool />
        </ShowcaseShell>
      </ShowcaseGate>
    </Suspense>
  );
}
