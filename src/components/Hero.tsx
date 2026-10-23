import Link from "next/link";
import { profile } from "@/data/profile";

const actions = [
  { href: profile.github, label: "GitHub", external: true, primary: true },
  { href: profile.linkedin, label: "LinkedIn", external: true, primary: false },
  { href: "/resume", label: "Resume", external: false, primary: false },
];

export function Hero() {
  return (
    <section id="top" className="px-5 pt-16 pb-12 sm:pt-24 sm:pb-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm text-muted-foreground">
          {profile.role} · {profile.location}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{profile.summary}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {actions.map((action) =>
            action.external ? (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  action.primary
                    ? "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                    : "inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
                }
              >
                {action.label}
              </a>
            ) : (
              <Link
                key={action.label}
                href={action.href}
                className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
              >
                {action.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
