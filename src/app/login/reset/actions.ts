"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import {
  findValidPasswordResetToken,
  markPasswordResetTokenUsed,
  updateUserPassword,
} from "@/db";
import { hashResetToken } from "@/lib/password-reset";

export type ResetState = { error: string };

export async function resetPassword(_state: ResetState, formData: FormData): Promise<ResetState> {
  const token = String(formData.get("token") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) return { error: "This reset link is invalid or has expired." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const record = await findValidPasswordResetToken(hashResetToken(token));
  if (!record) return { error: "This reset link is invalid or has expired." };

  const passwordHash = await hash(password, 10);
  await updateUserPassword(record.userId, passwordHash);
  await markPasswordResetTokenUsed(record.id);

  redirect("/login");
}
