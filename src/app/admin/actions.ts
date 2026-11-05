"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { deleteProject as removeProject, insertProject, updateProject } from "@/db";

export type FormState = { error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function readProject(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const stack = String(formData.get("stack") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const href = String(formData.get("href") ?? "").trim();
  const repo = String(formData.get("repo") ?? "").trim();
  const errors: string[] = [];

  if (!title) errors.push("Title is required.");
  if (!description) errors.push("Description is required.");
  if (href && !isHttpUrl(href)) errors.push("Live URL must start with http:// or https://.");
  if (repo && !isHttpUrl(repo)) errors.push("Repo URL must start with http:// or https://.");

  return { title, description, stack, href, repo, error: errors.join(" ") };
}

function readId(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id < 1) return undefined;
  return id;
}

export async function createProject(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const project = readProject(formData);
  if (project.error) return { error: project.error };

  await insertProject(project);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
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
  redirect("/admin/projects");
}

export async function removeProjectAction(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  if (!id) redirect("/admin/projects");

  await removeProject(id);
  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}
