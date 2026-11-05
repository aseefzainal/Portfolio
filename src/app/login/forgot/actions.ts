"use server";

import { headers } from "next/headers";
import {
  createPasswordResetToken,
  getUserByEmail,
} from "@/db";
import { sendEmail } from "@/lib/mail";
import { createResetToken, hashResetToken, resetExpiryIso } from "@/lib/password-reset";

export type ForgotState = {
  error: string;
  message: string;
  resetUrl?: string;
};

async function appBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return process.env.AUTH_URL ?? "http://localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function requestPasswordReset(_state: ForgotState, formData: FormData): Promise<ForgotState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { error: "Email is required.", message: "" };
  }

  const generic = {
    error: "",
    message: "If that email is registered, a reset link has been sent.",
  };

  const user = await getUserByEmail(email);
  if (!user) return generic;

  const token = createResetToken();
  await createPasswordResetToken(user.id, hashResetToken(token), resetExpiryIso());
  const resetUrl = `${await appBaseUrl()}/login/reset?token=${token}`;

  const mailed = await sendEmail({
    to: user.email,
    subject: "Reset your portfolio admin password",
    html: `<p>Reset your password with this link (valid for 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  if (!mailed.ok && process.env.NODE_ENV === "development") {
    return { ...generic, resetUrl };
  }

  return generic;
}
