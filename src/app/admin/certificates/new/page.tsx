import Link from "next/link";
import { createTimelineEntry } from "@/app/admin/timeline/actions";
import { TimelineForm } from "@/components/admin/TimelineForm";
import { timelineSections } from "@/lib/timeline-admin";

const section = timelineSections.certificate;

export default function NewCertificatePage() {
  return (
    <div>
      <Link
        href={section.href}
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Back to {section.label.toLowerCase()}
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Add {section.singular}</h1>
      <div className="mt-6">
        <TimelineForm
          action={createTimelineEntry}
          kind={section.kind}
          submitLabel={`Add ${section.singular}`}
        />
      </div>
    </div>
  );
}
