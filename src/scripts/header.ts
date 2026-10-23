const themeKey = "theme";

function currentTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function initHeader() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (!header || header.dataset.ready === "true") return () => {};
  header.dataset.ready = "true";

  const controller = new AbortController();
  const listen = { signal: controller.signal };
  const themeButton = header.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  const menuButton = header.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const mobileNav = header.querySelector<HTMLElement>("#mobile-nav");
  const links = [...header.querySelectorAll<HTMLAnchorElement>("[data-nav]")];
  const ids = [...new Set(links.map((link) => link.dataset.nav).filter((id): id is string => Boolean(id)))];

  function paintTheme(theme: "light" | "dark") {
    if (!themeButton) return;
    themeButton.textContent = theme === "dark" ? "Light" : "Dark";
    themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  }

  paintTheme(currentTheme());

  themeButton?.addEventListener(
    "click",
    () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem(themeKey, next);
      paintTheme(next);
    },
    listen,
  );

  function setMenu(open: boolean) {
    if (!menuButton || !mobileNav) return;
    mobileNav.toggleAttribute("hidden", !open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.textContent = open ? "Close" : "Menu";
  }

  menuButton?.addEventListener("click", () => setMenu(mobileNav?.hasAttribute("hidden") ?? false), listen);
  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false), listen);
  });

  const sections = ids
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);
  const visible = new Set<string>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      const active = ids.find((id) => visible.has(id)) ?? null;
      for (const link of links) {
        const on = link.dataset.nav === active;
        link.classList.toggle("text-foreground", on);
        link.classList.toggle("text-muted-foreground", !on);
        if (on) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      }
    },
    { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
  );
  sections.forEach((section) => observer.observe(section));

  return () => {
    controller.abort();
    observer.disconnect();
    delete header.dataset.ready;
  };
}
