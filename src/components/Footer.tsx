import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 px-5 py-6 text-sm text-stone-500 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl justify-between gap-4">
        <p>
          {profile.name} · 2026
        </p>
        <a href="#top" className="hover:text-teal-700 dark:hover:text-teal-300">
          Back to top
        </a>
      </div>
    </footer>
  );
}
