import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveParagraph } from "@/app/admin/about/actions";
import { ParagraphEditForm } from "@/components/admin/SimpleTextForm";
import { AdminFormSkeleton } from "@/components/LoadingSkeletons";
import { getAboutParagraph } from "@/db";
import { io } from "next/cache";

async function EditParagraph({ id }: { id: string }) {
  await io();
  const paragraphId = Number(id);
  if (!Number.isInteger(paragraphId) || paragraphId < 1) notFound();
  const paragraph = await getAboutParagraph(paragraphId);
  if (!paragraph) notFound();

  return (
    <div>
      <Link href="/admin/about" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Back to about
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Edit paragraph</h1>
      <div className="mt-6">
        <ParagraphEditForm id={paragraph.id} body={paragraph.body} action={saveParagraph} />
      </div>
    </div>
  );
}

export default async function EditParagraphPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<AdminFormSkeleton />}>
      <EditParagraph id={id} />
    </Suspense>
  );
}
