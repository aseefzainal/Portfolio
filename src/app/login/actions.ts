"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function login(_state: { error: string }, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      rememberMe: formData.get("rememberMe") === "on" ? "true" : "false",
      redirectTo: "/admin/projects",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "The email or password is incorrect." };
    }
    throw error;
  }

  return { error: "" };
}
