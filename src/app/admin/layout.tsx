import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminShellSkeleton } from "@/components/LoadingSkeletons";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminShellSkeleton />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
