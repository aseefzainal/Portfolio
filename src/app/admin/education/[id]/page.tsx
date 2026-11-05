import { redirect } from "next/navigation";

export default function EditEducationRedirectPage() {
  redirect("/admin/resume?tab=education");
}
