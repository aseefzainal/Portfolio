import { SectionTitle } from "@/components/SectionTitle";
import { listTimelineEntries } from "@/db";
import { io } from "next/cache";

export async function Education() {
  await io();
  const items = await listTimelineEntries("education");

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
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.place}</p>
                  <p className="mt-2 text-sm leading-6">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
