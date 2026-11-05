import { redirect } from "next/navigation";

export default function NewSkillRedirectPage() {
  redirect("/admin/resume?tab=skills");
}
