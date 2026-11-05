import { redirect } from "next/navigation";

export default function AdminEducationRedirectPage() {
  redirect("/admin/resume?tab=education");
}
