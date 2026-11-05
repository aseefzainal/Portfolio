import { redirect } from "next/navigation";

export default function AdminExperienceRedirectPage() {
  redirect("/admin/resume?tab=experience");
}
