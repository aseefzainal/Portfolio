"use server";

import { revalidatePath } from "next/cache";
import { updateSiteProfile } from "@/db";
import { isHttpUrl, isProfilePhoto, requireAdmin } from "@/lib/admin";

export type ProfileFormState = { error: string; message: string };

export async function saveProfile(_state: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const github = String(formData.get("github") ?? "").trim();
  const linkedin = String(formData.get("linkedin") ?? "").trim();
  const resume = String(formData.get("resume") ?? "").trim();
  const githubUsername = String(formData.get("githubUsername") ?? "").trim();
  const photo = String(formData.get("photo") ?? "").trim();
  const photoShapeRaw = String(formData.get("photoShape") ?? "circle").trim();
  const photoShape =
    photoShapeRaw === "rounded" || photoShapeRaw === "square" ? photoShapeRaw : "circle";
  const errors: string[] = [];

  if (!name) errors.push("Name is required.");
  if (!role) errors.push("Role is required.");
  if (!summary) errors.push("Summary is required.");
  if (!location) errors.push("Location is required.");
  if (!email) errors.push("Email is required.");
  if (!githubUsername) errors.push("GitHub username is required.");
  if (!resume) errors.push("Resume path is required.");
  if (github && !isHttpUrl(github)) errors.push("GitHub URL must start with http:// or https://.");
  if (linkedin && !isHttpUrl(linkedin)) errors.push("LinkedIn URL must start with http:// or https://.");
  if (!isProfilePhoto(photo)) errors.push("Photo must be a compressed JPEG, PNG, or WebP image.");

  if (errors.length) return { error: errors.join(" "), message: "" };

  await updateSiteProfile({
    name,
    role,
    summary,
    location,
    email,
    github,
    linkedin,
    resume,
    githubUsername,
    photo,
    photoShape,
  });

  revalidatePath("/");
  revalidatePath("/resume");
  revalidatePath("/admin/profile");
  revalidatePath("/admin/resume");
  return { error: "", message: "Profile saved." };
}
