"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import {
  publishStudioResume,
  unpublishStudioResume,
  type StudioState,
} from "@/app/admin/resume/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initial: StudioState = { error: "", message: "" };

export function PublishResumeButton({ initiallyPublished }: { initiallyPublished: boolean }) {
  const [published, setPublished] = useState(initiallyPublished);
  const [publishState, publishAction, publishPending] = useActionState(
    publishStudioResume,
    initial,
  );
  const [unpublishState, unpublishAction, unpublishPending] = useActionState(
    unpublishStudioResume,
    initial,
  );

  useEffect(() => {
    if (publishState.published === true) setPublished(true);
  }, [publishState.published, publishState.message]);

  useEffect(() => {
    if (unpublishState.published === false) setPublished(false);
  }, [unpublishState.published, unpublishState.message]);

  const state = publishState.message || publishState.error ? publishState : unpublishState;
  const pending = publishPending || unpublishPending;

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <div className="flex flex-wrap items-center gap-2">
        {published ? (
          <>
            <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              Live on /resume
            </span>
            <Link
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              View page
            </Link>
            <form action={unpublishAction}>
              <Button type="submit" variant="outline" size="sm" disabled={pending}>
                {unpublishPending ? "Unpublishing…" : "Unpublish"}
              </Button>
            </form>
          </>
        ) : (
          <form action={publishAction}>
            <Button type="submit" size="sm" disabled={pending}>
              {publishPending ? "Publishing…" : "Publish to resume page"}
            </Button>
          </form>
        )}
      </div>
      {state.error ? (
        <Alert variant="destructive" className="max-w-sm">
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      {state.message ? (
        <Alert className="max-w-sm">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
