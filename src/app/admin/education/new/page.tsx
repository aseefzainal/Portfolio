import { redirect } from "next/navigation";

export default function NewEducationRedirectPage() {
  redirect("/admin/resume?tab=education");
}
