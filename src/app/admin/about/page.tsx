import Link from "next/link";
import { Suspense } from "react";
import {
  createFactAction,
  createParagraphAction,
  removeFactAction,
  removeParagraphAction,
} from "@/app/admin/about/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { listAboutFacts, listAboutParagraphs } from "@/db";
import { cn } from "@/lib/utils";
import { io } from "next/cache";

async function AboutManager() {
  await io();
  const [paragraphs, facts] = await Promise.all([listAboutParagraphs(), listAboutFacts()]);

  return (
    <div className="grid gap-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="mt-2 text-sm text-muted-foreground">Paragraphs and fact cards on the homepage.</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Paragraphs</h2>
        {paragraphs.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No paragraphs yet.</p>
        ) : (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Body</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paragraphs.map((paragraph) => (
                  <TableRow key={paragraph.id}>
                    <TableCell className="max-w-2xl whitespace-normal text-muted-foreground">
                      {paragraph.body}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/about/paragraphs/${paragraph.id}`}
                          className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
                        >
                          Edit
                        </Link>
                        <DeleteButton id={paragraph.id} action={removeParagraphAction} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <form action={createParagraphAction} className="mt-6 grid max-w-xl gap-3">
          <div className="grid gap-2">
            <Label htmlFor="body">New paragraph</Label>
            <Textarea id="body" name="body" required rows={4} placeholder="New paragraph" />
          </div>
          <Button type="submit" className="h-10 w-fit">
            Add paragraph
          </Button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Facts</h2>
        {facts.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No facts yet.</p>
        ) : (
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Text</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facts.map((fact) => (
                  <TableRow key={fact.id}>
                    <TableCell className="font-medium">{fact.title}</TableCell>
                    <TableCell className="text-muted-foreground">{fact.text}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/about/facts/${fact.id}`}
                          className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
                        >
                          Edit
                        </Link>
                        <DeleteButton id={fact.id} action={removeFactAction} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <form action={createFactAction} className="mt-6 grid max-w-xl gap-3">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="Title" className="h-10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text">Text</Label>
            <Input id="text" name="text" required placeholder="Text" className="h-10" />
          </div>
          <Button type="submit" className="h-10 w-fit">
            Add fact
          </Button>
        </form>
      </section>
    </div>
  );
}

export default function AdminAboutPage() {
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading about…</p>}>
      <AboutManager />
    </Suspense>
  );
}
