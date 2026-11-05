import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveFact } from "@/app/admin/about/actions";
import { FactEditForm } from "@/components/admin/SimpleTextForm";
import { getAboutFact } from "@/db";
import { io } from "next/cache";

async function EditFact({ id }: { id: string }) {
  await io();
  const factId = Number(id);
  if (!Number.isInteger(factId) || factId < 1) notFound();
  const fact = await getAboutFact(factId);
  if (!fact) notFound();

  return (
    <div>
      <Link href="/admin/about" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Back to about
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Edit fact</h1>
      <div className="mt-6">
        <FactEditForm id={fact.id} title={fact.title} text={fact.text} action={saveFact} />
      </div>
    </div>
  );
}

export default async function EditFactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <EditFact id={id} />
    </Suspense>
  );
}
