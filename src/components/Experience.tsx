import { ExperienceMapPanel } from "@/components/ExperienceMap";
import { SectionTitle } from "@/components/SectionTitle";
import { listTimelineEntries } from "@/db";
import { io } from "next/cache";

export async function Experience() {
  await io();
  const items = await listTimelineEntries("work", { showOnSite: true });

  return (
    <section id="experience" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionTitle kicker="Career" title="Experience" />
        <ExperienceMapPanel
          items={items.map((item) => ({
            id: item.id,
            title: item.title,
            place: item.place,
            period: item.period,
            detail: item.detail,
            location: item.location,
            isCurrent: item.isCurrent,
            mapLat: item.mapLat,
            mapLng: item.mapLng,
          }))}
        />
      </div>
    </section>
  );
}
