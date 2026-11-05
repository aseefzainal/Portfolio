import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-stone-500">Loading…</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
