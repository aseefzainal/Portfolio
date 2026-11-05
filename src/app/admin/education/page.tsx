import { Suspense } from "react";
import { TimelineEntriesManager } from "@/components/admin/TimelineEntriesManager";
import { timelineSections } from "@/lib/timeline-admin";

const section = timelineSections.education;

export default function AdminEducationPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{section.label}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
      <div className="mt-6">
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading education…</p>}>
          <TimelineEntriesManager section={section} />
        </Suspense>
      </div>
    </div>
  );
}
