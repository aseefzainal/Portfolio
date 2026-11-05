import { redirect } from "next/navigation";

export default function AdminCertificatesRedirectPage() {
  redirect("/admin/resume?tab=certificates");
}
