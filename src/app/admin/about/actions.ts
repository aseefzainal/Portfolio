"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteAboutFact,
  deleteAboutParagraph,
  insertAboutFact,
  insertAboutParagraph,
  updateAboutFact,
  updateAboutParagraph,
} from "@/db";
import { readId, requireAdmin, type FormState } from "@/lib/admin";

function revalidateAbout() {
  revalidatePath("/");
  revalidatePath("/admin/about");
}

export async function createParagraphAction(formData: FormData) {
  await requireAdmin();
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;
  await insertAboutParagraph(body);
  revalidateAbout();
  redirect("/admin/about");
}

export async function saveParagraph(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = readId(formData);
  if (!id) return { error: "That paragraph could not be found." };
  const body = String(formData.get("body") ?? "").trim();
  if (!body) return { error: "Paragraph text is required." };
  await updateAboutParagraph(id, body);
  revalidateAbout();
  redirect("/admin/about");
}

export async function removeParagraphAction(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  if (id) await deleteAboutParagraph(id);
  revalidateAbout();
  redirect("/admin/about");
}

export async function createFactAction(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  if (!title || !text) return;
  await insertAboutFact({ title, text });
  revalidateAbout();
  redirect("/admin/about");
}

export async function saveFact(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = readId(formData);
  if (!id) return { error: "That fact could not be found." };
  const title = String(formData.get("title") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  if (!title || !text) return { error: "Title and text are required." };
  await updateAboutFact(id, { title, text });
  revalidateAbout();
  redirect("/admin/about");
}

export async function removeFactAction(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  if (id) await deleteAboutFact(id);
  revalidateAbout();
  redirect("/admin/about");
}
