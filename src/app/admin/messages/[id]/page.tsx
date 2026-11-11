import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteMessageAction } from "@/app/admin/messages/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminFormSkeleton } from "@/components/LoadingSkeletons";
import { buttonVariants } from "@/components/ui/button";
import { getContactMessage, markContactMessageRead } from "@/db";
import { cn } from "@/lib/utils";
import { io, revalidatePath } from "next/cache";

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function MessageDetail({ id }: { id: number }) {
  await io();
  const message = await getContactMessage(id);
  if (!message) notFound();

  if (!message.readAt) {
    await markContactMessageRead(id);
    revalidatePath("/admin");
    revalidatePath("/admin/messages");
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/messages"
        className={cn(buttonVariants({ variant: "link" }), "h-auto px-0")}
      >
        ← Messages
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight">{message.name}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        <a href={`mailto:${message.email}`} className="hover:text-foreground">
          {message.email}
        </a>
        <span className="mx-2">·</span>
        {formatWhen(message.createdAt)}
      </p>

      <div className="mt-8 whitespace-pre-wrap rounded-md border px-4 py-4 text-sm leading-6">
        {message.message}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: Portfolio message`)}`}
          className={cn(buttonVariants(), "h-10")}
        >
          Reply by email
        </a>
        <DeleteButton
          id={message.id}
          action={deleteMessageAction}
          confirmMessage="Delete this message?"
        />
      </div>
    </div>
  );
}

export default async function AdminMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) notFound();

  return (
    <Suspense fallback={<AdminFormSkeleton />}>
      <MessageDetail id={id} />
    </Suspense>
  );
}
