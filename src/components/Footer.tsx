import { getSiteProfile } from "@/db";
import { io } from "next/cache";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#certificates", label: "Certificates" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export async function Footer() {
  await io();
  const profile = await getSiteProfile();

  return (
    <footer className="px-5 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 border-t pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground">{profile.name} · 2026</p>
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
