import { SectionTitle } from "@/components/SectionTitle";
import { listTimelineEntries } from "@/db";
import { io } from "next/cache";

export async function Certificates() {
  await io();
  const items = await listTimelineEntries("certificate");
  if (items.length === 0) return null;

  return (
    <section id="certificates" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Credentials" title="Certificates" />
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
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
                  >
                    Credential
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
