import { SectionTitle } from "@/components/SectionTitle";
import { profile } from "@/data/profile";

const facts = [
  { title: "Laravel", text: "Systems, reports, and permissions" },
  { title: "Next.js", text: "This portfolio, in public" },
  { title: "Malaysia", text: "Based here" },
  { title: "Open", text: "Freelance and full-time" },
];

export function About() {
  return (
    <section id="about" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Profile" title="About" />
        <div className="mt-8 grid gap-5">
          {profile.about.map((paragraph) => (
            <p key={paragraph} data-reveal className="leading-7 text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
        <ul className="mt-8 grid border-t sm:grid-cols-2">
          {facts.map((fact) => (
            <li key={fact.title} data-reveal className="border-b py-4 sm:odd:pr-6 sm:even:pl-6">
              <h3 className="text-sm font-medium">{fact.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{fact.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
