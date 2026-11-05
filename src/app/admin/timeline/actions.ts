"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteTimelineEntry, insertTimelineEntry, updateTimelineEntry } from "@/db";
import type { TimelineKind } from "@/db/schema";
import { isHttpUrl, readId, requireAdmin, type FormState } from "@/lib/admin";
import { pathForKind } from "@/lib/timeline-admin";

function revalidateTimeline(kind: TimelineKind) {
  revalidatePath("/");
  revalidatePath(pathForKind(kind));
}

function readKind(value: FormDataEntryValue | null): TimelineKind | undefined {
  if (value === "work" || value === "education" || value === "certificate") return value;
  return undefined;
}

function readEntry(formData: FormData) {
  const kind = readKind(formData.get("kind"));
  const title = String(formData.get("title") ?? "").trim();
  const place = String(formData.get("place") ?? "").trim();
  const period = String(formData.get("period") ?? "").trim();
  const detail = String(formData.get("detail") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim();
  const errors: string[] = [];

  if (!kind) errors.push("Kind is required.");
  if (!title) errors.push("Title is required.");
  if (!place) errors.push("Place is required.");
  if (!period) errors.push("Period is required.");
  if (!detail) errors.push("Detail is required.");
  if (href && !isHttpUrl(href)) errors.push("URL must start with http:// or https://.");

  return { kind, title, place, period, detail, href, error: errors.join(" ") };
}

export async function createTimelineEntry(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const entry = readEntry(formData);
  if (entry.error || !entry.kind) return { error: entry.error || "Kind is required." };

  await insertTimelineEntry({
    kind: entry.kind,
    title: entry.title,
    place: entry.place,
    period: entry.period,
    detail: entry.detail,
    href: entry.href,
  });
  revalidateTimeline(entry.kind);
  redirect(pathForKind(entry.kind));
}

export async function saveTimelineEntry(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = readId(formData);
  if (!id) return { error: "That entry could not be found." };

  const entry = readEntry(formData);
  if (entry.error || !entry.kind) return { error: entry.error || "Kind is required." };

  await updateTimelineEntry(id, {
    kind: entry.kind,
    title: entry.title,
    place: entry.place,
    period: entry.period,
    detail: entry.detail,
    href: entry.href,
  });
  revalidateTimeline(entry.kind);
  redirect(pathForKind(entry.kind));
}

export async function removeTimelineEntryAction(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  const kind = readKind(formData.get("kind")) ?? "work";
  if (id) await deleteTimelineEntry(id);
  revalidateTimeline(kind);
  redirect(pathForKind(kind));
}
