import Link from "next/link";
import { removeTimelineEntryAction } from "@/app/admin/timeline/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listTimelineEntries } from "@/db";
import type { TimelineSection } from "@/lib/timeline-admin";
import { cn } from "@/lib/utils";
import { io } from "next/cache";

export async function TimelineEntriesManager({ section }: { section: TimelineSection }) {
  await io();
  const entries = await listTimelineEntries(section.kind);

  return (
    <>
      <div className="flex justify-end">
        <Link href={`${section.href}/new`} className={cn(buttonVariants(), "h-10")}>
          Add {section.singular}
        </Link>
      </div>
      {entries.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No {section.label.toLowerCase()} yet.</p>
      ) : (
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Place / Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.place} · {entry.period}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`${section.href}/${entry.id}`}
                        className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        id={entry.id}
                        action={removeTimelineEntryAction}
                        hiddenFields={{ kind: section.kind }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
