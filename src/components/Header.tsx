import Image from "next/image";
import { profile } from "@/data/profile";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-background/90 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <a href="#top" className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight">
          <Image
            src="/logo.jpg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-lg"
            priority
          />
          {profile.name}
        </a>
        <nav aria-label="Page">
          <ul className="flex gap-3 text-sm text-stone-600 sm:gap-4 dark:text-stone-300">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-teal-700 dark:hover:text-teal-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
