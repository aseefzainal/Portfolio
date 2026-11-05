import { SectionTitle } from "@/components/SectionTitle";
import { listAboutFacts, listAboutParagraphs } from "@/db";
import { io } from "next/cache";

export async function About() {
  await io();
  const [paragraphs, facts] = await Promise.all([listAboutParagraphs(), listAboutFacts()]);

  return (
    <section id="about" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Profile" title="About" />
        <div className="mt-8 grid gap-5">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.id} data-reveal className="leading-7 text-muted-foreground">
              {paragraph.body}
            </p>
          ))}
        </div>
        {facts.length > 0 ? (
          <ul className="mt-8 grid border-t sm:grid-cols-2">
            {facts.map((fact) => (
              <li key={fact.id} data-reveal className="border-b py-4 sm:odd:pr-6 sm:even:pl-6">
                <h3 className="text-sm font-medium">{fact.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{fact.text}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
