import { redirect } from "next/navigation";

export default function AdminSkillsRedirectPage() {
  redirect("/admin/resume?tab=skills");
}
