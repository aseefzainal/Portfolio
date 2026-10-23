import { ContactEffect } from "@/components/ClientEffects";
import { SectionTitle } from "@/components/SectionTitle";
import { profile } from "@/data/profile";

const links = [
  { href: `mailto:${profile.email}`, label: "Email", text: profile.email, external: false },
  { href: profile.github, label: "GitHub", text: "Projects and contribution history.", external: true },
  { href: profile.linkedin, label: "LinkedIn", text: "Work history and a direct message.", external: true },
];

export function Contact() {
  return (
    <section id="contact" className="px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionTitle kicker="Hello" title="Contact" />
        <p data-reveal className="mt-4 max-w-xl text-muted-foreground">
          Open to freelance and full-time roles. The fastest way to reach me is email.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {links.map((link) => (
            <li key={link.label} data-reveal>
              <a
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="block h-full rounded-md border bg-card p-4 hover:bg-accent"
              >
                <span className="text-sm font-medium">{link.label}</span>
                <span className="mt-3 block text-sm leading-6 text-muted-foreground">{link.text}</span>
              </a>
            </li>
          ))}
        </ul>
        <form id="contact-form" className="mt-8 grid max-w-xl gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Name
            <input
              name="name"
              required
              autoComplete="name"
              className="h-10 rounded-md border bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-10 rounded-md border bg-background px-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Message
            <textarea
              name="message"
              required
              minLength={10}
              rows={5}
              className="rounded-md border bg-background px-3 py-2 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <button
            type="submit"
            className="h-10 w-fit rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            Send message
          </button>
          <p role="status" data-status hidden />
        </form>
      </div>
      <ContactEffect />
    </section>
  );
}
