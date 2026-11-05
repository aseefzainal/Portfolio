import { redirect } from "next/navigation";

export default function NewCertificateRedirectPage() {
  redirect("/admin/resume?tab=certificates");
}
