import type { MetadataRoute } from "next";
import { listShowcaseTools } from "@/db";
import { getSiteUrl } from "@/lib/site-url";
import { io } from "next/cache";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await io();
  const base = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/resume`, changeFrequency: "weekly", priority: 0.8 },
  ];

  try {
    const tools = await listShowcaseTools({ enabled: true });
    if (tools.length > 0) {
      entries.push({ url: `${base}/showcase`, changeFrequency: "monthly", priority: 0.6 });
      for (const tool of tools) {
        entries.push({
          url: `${base}${tool.href}`,
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    }
  } catch {
    // D1 unavailable during static analysis — homepage entries still return.
  }

  return entries;
}