import { redirect } from "next/navigation";

export default function EditSkillRedirectPage() {
  redirect("/admin/resume?tab=skills");
}
