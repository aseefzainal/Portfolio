import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type FormState = { error: string };

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function readId(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return undefined;
  return id;
}

const PHOTO_MAX_CHARS = 350_000;

export function isProfilePhoto(value: string) {
  if (!value) return true;
  if (value.length > PHOTO_MAX_CHARS) return false;
  return /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value);
}
