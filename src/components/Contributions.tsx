import { SectionTitle } from "@/components/SectionTitle";
import { profile } from "@/data/profile";

const username = "aseefzainal";
const lightChart = `https://ghchart.rshah.org/171717/${username}`;
const darkChart = `https://ghchart.rshah.org/a3a3a3/${username}`;

export function Contributions() {
  return (
    <section id="contributions" className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <SectionTitle kicker="Activity" title="GitHub" />
        <p data-reveal className="mt-4 text-sm text-muted-foreground">
          Contributions over the past year on {username}.
        </p>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          data-reveal
          className="mt-6 block overflow-x-auto rounded-md border bg-card p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightChart}
            alt={`GitHub contribution graph for ${username}`}
            className="h-auto w-full min-w-[720px] dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={darkChart} alt="" aria-hidden="true" className="hidden h-auto w-full min-w-[720px] dark:block" />
        </a>
      </div>
    </section>
  );
}
