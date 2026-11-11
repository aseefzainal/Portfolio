"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteSkill, insertSkill, updateSkill } from "@/db";
import { readId, requireAdmin, type FormState } from "@/lib/admin";
import { parseSkillLevel } from "@/lib/skill-level";

function revalidateSkills() {
  revalidatePath("/");
  revalidatePath("/admin/skills");
}

function readSkill(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawIcon = String(formData.get("iconSlug") ?? "").trim();
  const iconSlug = rawIcon === "__none__" ? "" : rawIcon;
  const color = String(formData.get("color") ?? "").trim();
  const level = parseSkillLevel(String(formData.get("level") ?? ""));
  if (!name) return { error: "Name is required.", name, iconSlug, color, level };
  return { error: "", name, iconSlug, color, level };
}

export async function createSkill(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const skill = readSkill(formData);
  if (skill.error) return { error: skill.error };
  await insertSkill({
    name: skill.name,
    iconSlug: skill.iconSlug,
    color: skill.color,
    level: skill.level,
  });
  revalidateSkills();
  redirect("/admin/skills");
}

export async function saveSkill(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = readId(formData);
  if (!id) return { error: "That skill could not be found." };
  const skill = readSkill(formData);
  if (skill.error) return { error: skill.error };
  await updateSkill(id, {
    name: skill.name,
    iconSlug: skill.iconSlug,
    color: skill.color,
    level: skill.level,
  });
  revalidateSkills();
  redirect("/admin/skills");
}

export async function removeSkillAction(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  if (id) await deleteSkill(id);
  revalidateSkills();
  redirect("/admin/skills");
}
