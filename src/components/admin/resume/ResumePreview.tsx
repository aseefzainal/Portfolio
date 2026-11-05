"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { ResumeDraft } from "@/components/admin/resume/types";
import { profilePhotoShapeClass } from "@/lib/profile-photo";
import { cn } from "@/lib/utils";

function Section({
  title,
  keepKey,
  children,
  spacer = 0,
}: {
  title: string;
  keepKey: string;
  children: React.ReactNode;
  spacer?: number;
}) {
  return (
    <section className="mt-5">
      {spacer > 0 ? <div aria-hidden className="pointer-events-none" style={{ height: spacer }} /> : null}
      <h2
        data-resume-keep="heading"
        data-resume-key={keepKey}
        className="border-b border-neutral-300 pb-1 text-[11px] font-semibold tracking-[0.14em] text-neutral-800 uppercase"
      >
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Keep({
  id,
  kind = "item",
  spacer = 0,
  children,
  className,
}: {
  id: string;
  kind?: "item" | "heading" | "block";
  spacer?: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      {spacer > 0 ? <div aria-hidden className="pointer-events-none" style={{ height: spacer }} /> : null}
      <div data-resume-keep={kind} data-resume-key={id} className={className}>
        {children}
      </div>
    </>
  );
}

function ResumeBody({
  draft,
  spacers,
}: {
  draft: ResumeDraft;
  spacers: Record<string, number>;
}) {
  const { profile, experience, education, certificates, skills, projects } = draft;
  const resumeProjects = projects.filter((project) => project.showOnResume);
  const links = [profile.email, profile.location, profile.github, profile.linkedin].filter(Boolean);

  return (
    <div
      data-resume-body
      className="px-10 py-10 text-[12px] leading-5 text-neutral-900 sm:px-11 sm:py-11"
    >
      <Keep id="header" kind="block" spacer={spacers.header ?? 0}>
        <header className="flex items-start gap-4">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt=""
              className={cn(
                "size-20 shrink-0 object-cover ring-1 ring-neutral-200",
                profilePhotoShapeClass(profile.photoShape),
              )}
            />
          ) : null}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">{profile.name || "Your name"}</h1>
            <p className="mt-1 text-sm text-neutral-600">{profile.role || "Your role"}</p>
            {links.length ? (
              <p className="mt-2 text-[11px] text-neutral-500 break-all">{links.join(" · ")}</p>
            ) : null}
          </div>
        </header>
      </Keep>

      {profile.summary ? (
        <Keep id="summary" kind="block" spacer={spacers.summary ?? 0} className="mt-4">
          <p className="text-[12px] leading-5 text-neutral-700">{profile.summary}</p>
        </Keep>
      ) : null}

      <Section title="Experience" keepKey="section-experience" spacer={spacers["section-experience"] ?? 0}>
        {experience.length === 0 ? (
          <Keep id="experience-empty" spacer={spacers["experience-empty"] ?? 0}>
            <p className="text-neutral-400">No experience yet.</p>
          </Keep>
        ) : (
          <ul className="space-y-4">
            {experience.map((item) => (
              <li key={item.id}>
                <Keep id={`experience-${item.id}`} spacer={spacers[`experience-${item.id}`] ?? 0}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="font-medium">{item.title || "Title"}</p>
                    <p className="text-[11px] text-neutral-500">{item.period}</p>
                  </div>
                  <p className="text-neutral-600">{item.place}</p>
                  {item.detail ? <p className="mt-1 text-neutral-700">{item.detail}</p> : null}
                </Keep>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Education" keepKey="section-education" spacer={spacers["section-education"] ?? 0}>
        {education.length === 0 ? (
          <Keep id="education-empty" spacer={spacers["education-empty"] ?? 0}>
            <p className="text-neutral-400">No education yet.</p>
          </Keep>
        ) : (
          <ul className="space-y-4">
            {education.map((item) => (
              <li key={item.id}>
                <Keep id={`education-${item.id}`} spacer={spacers[`education-${item.id}`] ?? 0}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="font-medium">{item.title || "Title"}</p>
                    <p className="text-[11px] text-neutral-500">{item.period}</p>
                  </div>
                  <p className="text-neutral-600">{item.place}</p>
                  {item.detail ? <p className="mt-1 text-neutral-700">{item.detail}</p> : null}
                </Keep>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Certificates"
        keepKey="section-certificates"
        spacer={spacers["section-certificates"] ?? 0}
      >
        {certificates.length === 0 ? (
          <Keep id="certificates-empty" spacer={spacers["certificates-empty"] ?? 0}>
            <p className="text-neutral-400">No certificates yet.</p>
          </Keep>
        ) : (
          <ul className="space-y-4">
            {certificates.map((item) => (
              <li key={item.id}>
                <Keep id={`certificate-${item.id}`} spacer={spacers[`certificate-${item.id}`] ?? 0}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="font-medium">{item.title || "Title"}</p>
                    <p className="text-[11px] text-neutral-500">{item.period}</p>
                  </div>
                  <p className="text-neutral-600">{item.place}</p>
                  {item.detail ? <p className="mt-1 text-neutral-700">{item.detail}</p> : null}
                  {item.href ? (
                    <p className="mt-1 text-[11px] text-neutral-500 break-all">{item.href}</p>
                  ) : null}
                </Keep>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Skills" keepKey="section-skills" spacer={spacers["section-skills"] ?? 0}>
        {skills.length === 0 ? (
          <Keep id="skills-empty" spacer={spacers["skills-empty"] ?? 0}>
            <p className="text-neutral-400">No skills yet.</p>
          </Keep>
        ) : (
          <Keep id="skills" spacer={spacers.skills ?? 0}>
            <p className="text-neutral-700">
              {skills.map((skill) => skill.name).filter(Boolean).join(" · ")}
            </p>
          </Keep>
        )}
      </Section>

      <Section title="Projects" keepKey="section-projects" spacer={spacers["section-projects"] ?? 0}>
        {resumeProjects.length === 0 ? (
          <Keep id="projects-empty" spacer={spacers["projects-empty"] ?? 0}>
            <p className="text-neutral-400">No projects selected for resume.</p>
          </Keep>
        ) : (
          <ul className="space-y-4">
            {resumeProjects.map((project) => (
              <li key={project.id}>
                <Keep id={`project-${project.id}`} spacer={spacers[`project-${project.id}`] ?? 0}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <p className="font-medium">{project.title || "Title"}</p>
                    {project.stack.length > 0 ? (
                      <p className="text-[11px] text-neutral-500">{project.stack.join(" · ")}</p>
                    ) : null}
                  </div>
                  {project.description ? (
                    <p className="mt-1 text-neutral-700">{project.description}</p>
                  ) : null}
                </Keep>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function sameSpacers(a: Record<string, number>, b: Record<string, number>) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if ((a[key] ?? 0) !== (b[key] ?? 0)) return false;
  }
  return true;
}

function readPageInset(measure: HTMLElement) {
  const body = measure.querySelector<HTMLElement>("[data-resume-body]");
  if (!body) return 40;
  const top = parseFloat(getComputedStyle(body).paddingTop);
  return Number.isFinite(top) && top > 0 ? top : 40;
}

/** Push whole blocks to the next page instead of splitting them across the A4 cut. */
function computeSpacers(measure: HTMLElement, pageHeight: number): Record<string, number> {
  const rootTop = measure.getBoundingClientRect().top;
  const pageInsetTop = readPageInset(measure);
  const blocks = [...measure.querySelectorAll<HTMLElement>("[data-resume-keep]")];
  const next: Record<string, number> = {};
  let pageBottom = pageHeight;
  let extra = 0;

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const key = block.dataset.resumeKey;
    if (!key) continue;

    const naturalTop = block.getBoundingClientRect().top - rootTop;
    const height = block.offsetHeight;
    const top = naturalTop + extra;
    const bottom = top + height;

    while (top >= pageBottom - 0.5) {
      pageBottom += pageHeight;
    }

    if (bottom <= pageBottom + 0.5) continue;

    let targetKey = key;
    let targetTop = top;
    const prev = index > 0 ? blocks[index - 1] : null;
    if (prev?.dataset.resumeKeep === "heading" && prev.dataset.resumeKey) {
      const headingTop = prev.getBoundingClientRect().top - rootTop + extra;
      if (headingTop < pageBottom - 0.5) {
        targetKey = prev.dataset.resumeKey;
        targetTop = headingTop;
      }
    }

    // Land past the page cut plus the same top padding used on page 1.
    const push = pageBottom - targetTop + pageInsetTop;
    if (push <= 0.5) continue;
    next[targetKey] = (next[targetKey] ?? 0) + push;
    extra += push;
    pageBottom += pageHeight;
  }

  return next;
}

export function ResumePreview({ draft }: { draft: ResumeDraft }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [spacers, setSpacers] = useState<Record<string, number>>({});

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    const measure = measureRef.current;
    if (!sheet || !measure) return;

    const run = () => {
      const height = sheet.clientHeight;
      if (height <= 0) return;

      flushSync(() => {
        setPageHeight(height);
        setSpacers({});
      });

      const next = computeSpacers(measureRef.current ?? measure, height);

      flushSync(() => {
        setSpacers((prev) => (sameSpacers(prev, next) ? prev : next));
      });

      const finalMeasure = measureRef.current ?? measure;
      setPageCount(Math.max(1, Math.ceil(finalMeasure.scrollHeight / height)));
    };

    run();
    const observer = new ResizeObserver(run);
    observer.observe(sheet);
    return () => observer.disconnect();
  }, [draft]);

  return (
    <div className="space-y-4">
      {Array.from({ length: pageCount }, (_, index) => (
        <div key={index}>
          {pageCount > 1 ? (
            <p className="mb-1.5 text-xs text-muted-foreground">
              Page {index + 1} of {pageCount}
            </p>
          ) : null}
          <div
            ref={index === 0 ? sheetRef : undefined}
            className="relative aspect-[210/297] overflow-hidden rounded-sm border border-border bg-white"
          >
            <div
              ref={index === 0 ? measureRef : undefined}
              className="w-full"
              style={pageHeight ? { transform: `translateY(-${index * pageHeight}px)` } : undefined}
            >
              <ResumeBody draft={draft} spacers={spacers} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
