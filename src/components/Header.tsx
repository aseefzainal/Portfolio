import Link from "next/link";
import { Logo } from "@/components/Logo";
import { HeaderEffect } from "@/components/ClientEffects";
import { getSiteProfile } from "@/db";
import { io } from "next/cache";

const links = [
  { href: "#about", id: "about", label: "About", page: false },
  { href: "#experience", id: "experience", label: "Experience", page: false },
  { href: "#education", id: "education", label: "Education", page: false },
  { href: "#certificates", id: "certificates", label: "Certificates", page: false },
  { href: "#projects", id: "projects", label: "Projects", page: false },
  { href: "#skills", id: "skills", label: "Skills", page: false },
  { href: "/showcase", id: "showcase", label: "Showcase", page: true },
  { href: "#contributions", id: "contributions", label: "GitHub", page: false },
  { href: "#contact", id: "contact", label: "Contact", page: false },
];

export async function Header() {
  await io();
  const profile = await getSiteProfile();

  return (
    <header data-header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-5">
        <a href="#top" className="flex shrink-0 items-center gap-2 text-sm font-medium">
          <Logo className="h-5 w-auto" />
          <span>{profile.name.split(" ")[0]}</span>
        </a>
        <nav aria-label="Page" className="hidden lg:block">
          <ul className="flex items-center gap-4 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                {link.page ? (
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    data-nav={link.id}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-theme-toggle
            aria-pressed="false"
            className="inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-medium"
          >
            Dark
          </button>
          <button
            type="button"
            data-menu-toggle
            className="inline-flex h-8 items-center rounded-md border px-2.5 text-xs font-medium lg:hidden"
            aria-expanded="false"
            aria-controls="mobile-nav"
          >
            Menu
          </button>
        </div>
      </div>
      <nav id="mobile-nav" aria-label="Page" className="border-t lg:hidden" hidden>
        <ul className="mx-auto grid max-w-3xl px-5 py-2 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              {link.page ? (
                <Link
                  href={link.href}
                  className="block py-2 text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  data-nav={link.id}
                  className="block py-2 text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <HeaderEffect />
    </header>
  );
}
