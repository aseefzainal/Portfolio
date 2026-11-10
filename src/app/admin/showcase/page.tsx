import { Suspense } from "react";
import { toggleShowcaseToolAction } from "@/app/admin/showcase/actions";
import { AdminTableSkeleton } from "@/components/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listShowcaseTools } from "@/db";
import { io } from "next/cache";

async function ShowcaseManager() {
  await io();
  const tools = await listShowcaseTools();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Showcase</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enable or disable tools on the public Showcase page. Disabled tools stay hidden and their
        routes show an unavailable message.
      </p>

      {tools.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No showcase tools yet. Apply migrations.</p>
      ) : (
        <div className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="whitespace-normal">
                    <p className="font-medium">{tool.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{tool.href}</p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        tool.enabled
                          ? "text-sm font-medium text-emerald-700 dark:text-emerald-400"
                          : "text-sm text-muted-foreground"
                      }
                    >
                      {tool.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={toggleShowcaseToolAction}>
                      <input type="hidden" name="slug" value={tool.slug} />
                      <input type="hidden" name="enabled" value={tool.enabled ? "0" : "1"} />
                      <Button type="submit" variant="outline" size="sm">
                        {tool.enabled ? "Disable" : "Enable"}
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function AdminShowcasePage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <ShowcaseManager />
    </Suspense>
  );
}
