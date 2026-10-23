import { SectionTitle } from "@/components/SectionTitle";
import { profile } from "@/data/profile";

const items = profile.timeline.filter((item) => item.kind === "Education");

export function Education() {
  return (
    <section id="education" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Study" title="Education" />
        <ol className="mt-2">
          {items.map((item) => (
            <li
              key={`${item.title}-${item.period}`}
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
      </div>
    </section>
  );
}
