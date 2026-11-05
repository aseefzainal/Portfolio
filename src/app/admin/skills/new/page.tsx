import Link from "next/link";
import { createSkill } from "@/app/admin/skills/actions";
import { SkillForm } from "@/components/admin/SkillForm";

export default function NewSkillPage() {
  return (
    <div>
      <Link href="/admin/skills" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Back to skills
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Add skill</h1>
      <div className="mt-6">
        <SkillForm action={createSkill} submitLabel="Add skill" />
      </div>
    </div>
  );
}
