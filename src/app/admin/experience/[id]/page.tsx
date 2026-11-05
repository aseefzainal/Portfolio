import { redirect } from "next/navigation";

export default function EditExperienceRedirectPage() {
  redirect("/admin/resume?tab=experience");
}
