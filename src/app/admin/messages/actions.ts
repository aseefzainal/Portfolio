"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteContactMessage, markAllContactMessagesRead } from "@/db";
import { requireAdmin } from "@/lib/admin";

function parseId(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) throw new Error("Invalid message id.");
  return id;
}

export async function markAllMessagesReadAction() {
  await requireAdmin();
  await markAllContactMessagesRead();
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin();
  const id = parseId(formData);
  await deleteContactMessage(id);
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}
