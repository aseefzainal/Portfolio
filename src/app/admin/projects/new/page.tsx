import { redirect } from "next/navigation";

export default function NewProjectRedirectPage() {
  redirect("/admin/resume?tab=projects");
}
