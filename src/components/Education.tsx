import { SectionTitle } from "@/components/SectionTitle";
import { getSiteProfile, listTimelineEntries } from "@/db";
import { io } from "next/cache";

export async function Education() {
  await io();
  const profile = await getSiteProfile();
  if (!profile.sections.education.site) return null;
  const items = await listTimelineEntries("education", { showOnSite: true });

  return (
    <section id="education" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Study" title="Education" />
        {items.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">No education yet.</p>
        ) : (
          <ol className="mt-2">
            {items.map((item) => (
              <li
                key={item.id}
                data-reveal
                className="grid gap-1 border-b py-6 sm:grid-cols-[10.5rem_1fr] sm:gap-8"
              >
                <p className="text-sm text-muted-foreground">{item.period}</p>
                <div>
                  <h3 className="font-medium">{item.place || "School"}</h3>
                  {[item.title, item.fieldOfStudy].filter(Boolean).length > 0 ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {[item.title, item.fieldOfStudy].filter(Boolean).join(", ")}
                    </p>
                  ) : null}
                  {item.grade ? (
                    <p className="mt-1 text-sm text-muted-foreground">Grade: {item.grade}</p>
                  ) : null}
                  {item.activities ? (
                    <p className="mt-1 text-sm text-muted-foreground">{item.activities}</p>
                  ) : null}
                  {item.detail ? <p className="mt-2 text-sm leading-6">{item.detail}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
