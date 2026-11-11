"use server";

import { revalidatePath } from "next/cache";
import { setShowcaseToolEnabled } from "@/db";
import { isShowcaseSlug } from "@/data/showcase";
import { requireAdmin } from "@/lib/admin";

export async function toggleShowcaseToolAction(formData: FormData) {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "").trim();
  const enabled = String(formData.get("enabled") ?? "") === "1";
  if (!isShowcaseSlug(slug)) return;
  await setShowcaseToolEnabled(slug, enabled);
  revalidatePath("/admin/showcase");
  revalidatePath("/showcase");
  revalidatePath(`/showcase/${slug}`);
  revalidatePath("/");
}
