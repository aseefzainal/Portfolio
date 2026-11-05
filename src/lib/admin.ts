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
