import { redirect } from "next/navigation";

export default function NewExperienceRedirectPage() {
  redirect("/admin/resume?tab=experience");
}
