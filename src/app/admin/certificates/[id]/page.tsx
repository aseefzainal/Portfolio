import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveTimelineEntry } from "@/app/admin/timeline/actions";
import { TimelineForm } from "@/components/admin/TimelineForm";
import { getTimelineEntry } from "@/db";
import { timelineSections } from "@/lib/timeline-admin";
import { io } from "next/cache";

const section = timelineSections.certificate;

async function EditCertificate({ id }: { id: string }) {
  await io();
  const entryId = Number(id);
  if (!Number.isInteger(entryId) || entryId < 1) notFound();
  const entry = await getTimelineEntry(entryId);
  if (!entry || entry.kind !== section.kind) notFound();

  return (
    <div>
      <Link
        href={section.href}
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Back to {section.label.toLowerCase()}
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Edit {section.singular}</h1>
      <div className="mt-6">
        <TimelineForm
          action={saveTimelineEntry}
          kind={section.kind}
          entry={entry}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <EditCertificate id={id} />
    </Suspense>
  );
}
