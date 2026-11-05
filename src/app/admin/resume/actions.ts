"use server";

import { revalidatePath } from "next/cache";
import {
  deleteProject,
  deleteSkill,
  deleteTimelineEntry,
  getSiteProfile,
  insertProject,
  insertSkill,
  insertTimelineEntry,
  setResumePublished,
  updateProject,
  updateSiteProfile,
  updateSkill,
  updateTimelineEntry,
} from "@/db";
import type { TimelineKind } from "@/db/schema";
import { isHttpUrl, isProfilePhoto, readId, requireAdmin } from "@/lib/admin";
import { pathForKind } from "@/lib/timeline-admin";

export type StudioState = { error: string; message: string; id?: number; published?: boolean };

function revalidateStudio(kind?: TimelineKind) {
  revalidatePath("/");
  revalidatePath("/resume");
  revalidatePath("/admin/resume");
  revalidatePath("/admin/profile");
  revalidatePath("/admin/skills");
  revalidatePath("/admin/projects");
  if (kind) revalidatePath(pathForKind(kind));
}

function readKind(value: FormDataEntryValue | null): TimelineKind | undefined {
  if (value === "work" || value === "education" || value === "certificate") return value;
  return undefined;
}

export async function saveStudioProfile(
  _state: StudioState,
  formData: FormData,
): Promise<StudioState> {
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

  const current = await getSiteProfile();
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
    resumePublished: current.resumePublished,
  });
  revalidateStudio();
  return { error: "", message: "Profile saved." };
}

export async function publishStudioResume(
  _state: StudioState,
  _formData: FormData,
): Promise<StudioState> {
  await requireAdmin();
  await setResumePublished(true);
  revalidateStudio();
  return { error: "", message: "Resume published to the public page.", published: true };
}

export async function unpublishStudioResume(
  _state: StudioState,
  _formData: FormData,
): Promise<StudioState> {
  await requireAdmin();
  await setResumePublished(false);
  revalidateStudio();
  return { error: "", message: "Resume unpublished from the public page.", published: false };
}

export async function saveStudioTimelineEntry(
  _state: StudioState,
  formData: FormData,
): Promise<StudioState> {
  await requireAdmin();

  const kind = readKind(formData.get("kind"));
  const title = String(formData.get("title") ?? "").trim();
  const place = String(formData.get("place") ?? "").trim();
  const period = String(formData.get("period") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const rawId = Number(formData.get("id"));
  const errors: string[] = [];

  if (!kind) errors.push("Kind is required.");
  if (!title) errors.push("Title is required.");
  if (!place) errors.push("Place is required.");
  if (!period) errors.push("Period is required.");
  if (!detail) errors.push("Detail is required.");
  if (href && !isHttpUrl(href)) errors.push("URL must start with http:// or https://.");
  if (errors.length || !kind) return { error: errors.join(" ") || "Kind is required.", message: "" };

  const payload = { kind, title, place, period, detail, href };

  if (Number.isInteger(rawId) && rawId > 0) {
    await updateTimelineEntry(rawId, payload);
    revalidateStudio(kind);
    return { error: "", message: "Entry saved.", id: rawId };
  }

  const id = await insertTimelineEntry(payload);
  revalidateStudio(kind);
  return { error: "", message: "Entry added.", id };
}

export async function deleteStudioTimelineEntry(formData: FormData): Promise<StudioState> {
  await requireAdmin();
  const id = readId(formData);
  const kind = readKind(formData.get("kind")) ?? "work";
  if (id) await deleteTimelineEntry(id);
  revalidateStudio(kind);
  return { error: "", message: "Entry deleted." };
}

export async function saveStudioSkill(_state: StudioState, formData: FormData): Promise<StudioState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const rawIcon = String(formData.get("iconSlug") ?? "").trim();
  const iconSlug = rawIcon === "__none__" ? "" : rawIcon;
  const color = String(formData.get("color") ?? "").trim();
  const rawId = Number(formData.get("id"));

  if (!name) return { error: "Name is required.", message: "" };

  if (Number.isInteger(rawId) && rawId > 0) {
    await updateSkill(rawId, { name, iconSlug, color });
    revalidateStudio();
    return { error: "", message: "Skill saved.", id: rawId };
  }

  const id = await insertSkill({ name, iconSlug, color });
  revalidateStudio();
  return { error: "", message: "Skill added.", id };
}

export async function deleteStudioSkill(formData: FormData): Promise<StudioState> {
  await requireAdmin();
  const id = readId(formData);
  if (id) await deleteSkill(id);
  revalidateStudio();
  return { error: "", message: "Skill deleted." };
}

export async function saveStudioProject(
  _state: StudioState,
  formData: FormData,
): Promise<StudioState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const stack = String(formData.get("stack") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const href = String(formData.get("href") ?? "").trim();
  const repo = String(formData.get("repo") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim();
  const mark = String(formData.get("mark") ?? "").trim();
  const showOnSite = formData.get("showOnSite") === "on";
  const showOnResume = formData.get("showOnResume") === "on";
  const rawId = Number(formData.get("id"));
  const errors: string[] = [];

  if (!title) errors.push("Title is required.");
  if (!description) errors.push("Description is required.");
  if (href && !isHttpUrl(href)) errors.push("Live URL must start with http:// or https://.");
  if (repo && !isHttpUrl(repo)) errors.push("Repo URL must start with http:// or https://.");
  if (errors.length) return { error: errors.join(" "), message: "" };

  const payload = {
    title,
    description,
    stack,
    href,
    repo,
    image,
    mark,
    showOnSite,
    showOnResume,
  };

  try {
    if (Number.isInteger(rawId) && rawId > 0) {
      await updateProject(rawId, payload);
      revalidateStudio();
      return { error: "", message: "Project saved.", id: rawId };
    }

    const id = await insertProject(payload);
    revalidateStudio();
    return { error: "", message: "Project added.", id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save project.";
    return { error: message, message: "" };
  }
}

export async function deleteStudioProject(formData: FormData): Promise<StudioState> {
  await requireAdmin();
  const id = readId(formData);
  if (id) await deleteProject(id);
  revalidateStudio();
  return { error: "", message: "Project deleted." };
}
