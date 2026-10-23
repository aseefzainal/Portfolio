import { profile } from "@/data/profile";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="px-5 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 border-t pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">
          {profile.name} · 2026
        </p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-muted-foreground hover:text-foreground">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
