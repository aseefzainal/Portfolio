import Link from "next/link";
import { Suspense } from "react";
import { markAllMessagesReadAction } from "@/app/admin/messages/actions";
import { AdminTableSkeleton } from "@/components/LoadingSkeletons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { countUnreadContactMessages, listContactMessages } from "@/db";
import { cn } from "@/lib/utils";
import { io } from "next/cache";

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function preview(message: string) {
  const cleaned = message.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 96) return cleaned;
  return `${cleaned.slice(0, 96)}…`;
}

async function MessagesManager() {
  await io();
  const [messages, unreadCount] = await Promise.all([
    listContactMessages(),
    countUnreadContactMessages(),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Contact form submissions from the homepage.
            {unreadCount > 0 ? ` ${unreadCount} unread.` : ""}
          </p>
        </div>
        {unreadCount > 0 ? (
          <form action={markAllMessagesReadAction}>
            <Button type="submit" variant="outline" size="sm">
              Mark all as read
            </Button>
          </form>
        ) : null}
      </div>

      {messages.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((message) => {
                const unread = !message.readAt;
                return (
                  <TableRow key={message.id} className={unread ? "bg-muted/30" : undefined}>
                    <TableCell className="whitespace-normal align-top">
                      <p className={cn("font-medium", unread && "text-foreground")}>
                        {unread ? (
                          <span className="mr-2 inline-block size-1.5 rounded-full bg-foreground align-middle" />
                        ) : null}
                        {message.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{message.email}</p>
                    </TableCell>
                    <TableCell className="max-w-md whitespace-normal align-top text-muted-foreground">
                      {preview(message.message)}
                    </TableCell>
                    <TableCell className="align-top text-muted-foreground">
                      {formatWhen(message.createdAt)}
                    </TableCell>
                    <TableCell className="align-top text-right">
                      <Link
                        href={`/admin/messages/${message.id}`}
                        className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function AdminMessagesPage() {
  return (
    <Suspense fallback={<AdminTableSkeleton />}>
      <MessagesManager />
    </Suspense>
  );
}
