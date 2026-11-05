import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { saveSkill } from "@/app/admin/skills/actions";
import { SkillForm } from "@/components/admin/SkillForm";
import { getSkill } from "@/db";
import { io } from "next/cache";

async function EditSkill({ id }: { id: string }) {
  await io();
  const skillId = Number(id);
  if (!Number.isInteger(skillId) || skillId < 1) notFound();
  const skill = await getSkill(skillId);
  if (!skill) notFound();

  return (
    <div>
      <Link href="/admin/skills" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Back to skills
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Edit skill</h1>
      <div className="mt-6">
        <SkillForm action={saveSkill} skill={skill} submitLabel="Save changes" />
      </div>
    </div>
  );
}

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
      <EditSkill id={id} />
    </Suspense>
  );
}
