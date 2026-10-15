import { profile } from "@/data/profile";

const links = [
  { href: `mailto:${profile.email}`, label: profile.email, external: false },
  { href: profile.github, label: "GitHub", external: true },
  { href: profile.linkedin, label: "LinkedIn", external: true },
];

export function Contact() {
  return (
    <section id="contact" className="border-t border-stone-200 px-5 py-16 dark:border-white/10 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-sm font-semibold tracking-wide text-teal-700 uppercase dark:text-teal-300">
          Contact
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-8 text-stone-700 dark:text-stone-300">
          Open to freelance and full-time roles. The fastest way to reach me is email.
        </p>
        <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-6">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="text-base font-medium text-teal-800 underline-offset-4 hover:underline dark:text-teal-300"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
