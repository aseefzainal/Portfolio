"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteProject as removeProject, insertProject, updateProject } from "@/db";
import { isHttpUrl, readId, requireAdmin, type FormState } from "@/lib/admin";

export type { FormState };

function readProject(formData: FormData) {
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
  const errors: string[] = [];

  if (!title) errors.push("Title is required.");
  if (!description) errors.push("Description is required.");
  if (href && !isHttpUrl(href)) errors.push("Live URL must start with http:// or https://.");
  if (repo && !isHttpUrl(repo)) errors.push("Repo URL must start with http:// or https://.");

  return {
    title,
    description,
    stack,
    href,
    repo,
    image,
    mark,
    showOnSite,
    showOnResume,
    error: errors.join(" "),
  };
}

export async function createProject(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const project = readProject(formData);
  if (project.error) return { error: project.error };

  await insertProject(project);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/resume");
  redirect("/admin/resume?tab=projects");
}

export async function saveProject(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = readId(formData);
  if (!id) return { error: "That project could not be found." };

  const project = readProject(formData);
  if (project.error) return { error: project.error };

  await updateProject(id, project);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/resume");
  redirect("/admin/resume?tab=projects");
}

export async function removeProjectAction(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  if (!id) redirect("/admin/resume?tab=projects");

  await removeProject(id);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/resume");
  redirect("/admin/resume?tab=projects");
}
