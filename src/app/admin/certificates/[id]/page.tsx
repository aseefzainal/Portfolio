import { redirect } from "next/navigation";

export default function EditCertificateRedirectPage() {
  redirect("/admin/resume?tab=certificates");
}
