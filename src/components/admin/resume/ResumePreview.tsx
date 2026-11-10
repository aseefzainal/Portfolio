"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GripVerticalIcon } from "lucide-react";
import type { ResumeDraft } from "@/components/admin/resume/types";
import { profilePhotoShapeClass } from "@/lib/profile-photo";
import { cn } from "@/lib/utils";

export type ResumeReorderHandlers = {
  experience?: (fromIndex: number, toIndex: number) => void;
  education?: (fromIndex: number, toIndex: number) => void;
  certificates?: (fromIndex: number, toIndex: number) => void;
  projects?: (fromIndex: number, toIndex: number) => void;
};

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

function SortableRow({
  index,
  keepId,
  spacer = 0,
  enabled,
  onMove,
  children,
}: {
  index: number;
  keepId: string;
  spacer?: number;
  enabled?: boolean;
  onMove?: (fromIndex: number, toIndex: number) => void;
  children: React.ReactNode;
}) {
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState(false);

  if (!enabled || !onMove) {
    return (
      <li>
        <Keep id={keepId} spacer={spacer}>
          {children}
        </Keep>
      </li>
    );
  }

  return (
    <li>
      {/* Page-break spacer stays outside the handle so the grip sticks to content. */}
      {spacer > 0 ? <div aria-hidden className="pointer-events-none" style={{ height: spacer }} /> : null}
      <div
        data-resume-keep="item"
        data-resume-key={keepId}
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData("text/plain", String(index));
          event.dataTransfer.effectAllowed = "move";
          setDragging(true);
        }}
        onDragEnd={() => {
          setDragging(false);
          setOver(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          const from = Number(event.dataTransfer.getData("text/plain"));
          if (Number.isInteger(from)) onMove(from, index);
        }}
        className={cn(
          "relative rounded-sm transition-[box-shadow,opacity]",
          dragging && "opacity-40",
          over && "ring-1 ring-neutral-400",
        )}
      >
        <span
          aria-hidden
          className="absolute top-0.5 -left-5 flex h-5 w-4 cursor-grab items-center justify-center text-neutral-400 active:cursor-grabbing"
        >
          <GripVerticalIcon className="size-3.5" />
        </span>
        {children}
      </div>
    </li>
  );
}

function ResumeBody({
  draft,
  spacers,
  reorder,
}: {
  draft: ResumeDraft;
  spacers: Record<string, number>;
  reorder?: ResumeReorderHandlers;
}) {
  const { profile, experience, education, certificates, skills, projects } = draft;
  const resumeExperience = experience.filter((item) => item.showOnResume);
  const resumeEducation = education.filter((item) => item.showOnResume);
  const resumeProjects = projects.filter((project) => project.showOnResume);
  const links = [profile.email, profile.location, profile.github, profile.linkedin].filter(Boolean);
  const sortable = Boolean(reorder);

  return (
    <div
      data-resume-body
      className={cn(
        "px-10 py-10 text-[12px] leading-5 text-neutral-900 sm:px-11 sm:py-11",
        sortable && "pl-12 sm:pl-12",
      )}
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
        {resumeExperience.length === 0 ? (
          <Keep id="experience-empty" spacer={spacers["experience-empty"] ?? 0}>
            <p className="text-neutral-400">No experience yet.</p>
          </Keep>
        ) : (
          <ul className="space-y-4">
            {resumeExperience.map((item, index) => (
              <SortableRow
                key={item.id}
                index={index}
                keepId={`experience-${item.id}`}
                spacer={spacers[`experience-${item.id}`] ?? 0}
                enabled={Boolean(reorder?.experience)}
                onMove={reorder?.experience}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <p className="font-medium">{item.title || "Title"}</p>
                  <p className="text-[11px] text-neutral-500">{item.period}</p>
                </div>
                <p className="text-neutral-600">
                  {[item.place, item.employmentType].filter(Boolean).join(" · ") || "Company"}
                </p>
                {item.location || item.locationType ? (
                  <p className="text-[11px] text-neutral-500">
                    {[item.location, item.locationType].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                {item.detail ? <p className="mt-1 text-neutral-700">{item.detail}</p> : null}
              </SortableRow>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Education" keepKey="section-education" spacer={spacers["section-education"] ?? 0}>
        {resumeEducation.length === 0 ? (
          <Keep id="education-empty" spacer={spacers["education-empty"] ?? 0}>
            <p className="text-neutral-400">No education yet.</p>
          </Keep>
        ) : (
          <ul className="space-y-4">
            {resumeEducation.map((item, index) => (
              <SortableRow
                key={item.id}
                index={index}
                keepId={`education-${item.id}`}
                spacer={spacers[`education-${item.id}`] ?? 0}
                enabled={Boolean(reorder?.education)}
                onMove={reorder?.education}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <p className="font-medium">{item.place || "School"}</p>
                  <p className="text-[11px] text-neutral-500">{item.period}</p>
                </div>
                {[item.title, item.fieldOfStudy].filter(Boolean).length > 0 ? (
                  <p className="text-neutral-600">
                    {[item.title, item.fieldOfStudy].filter(Boolean).join(", ")}
                  </p>
                ) : null}
                {item.grade ? <p className="text-[11px] text-neutral-500">Grade: {item.grade}</p> : null}
                {item.activities ? (
                  <p className="mt-1 text-neutral-700">{item.activities}</p>
                ) : null}
                {item.detail ? <p className="mt-1 text-neutral-700">{item.detail}</p> : null}
              </SortableRow>
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
            {certificates.map((item, index) => (
              <SortableRow
                key={item.id}
                index={index}
                keepId={`certificate-${item.id}`}
                spacer={spacers[`certificate-${item.id}`] ?? 0}
                enabled={Boolean(reorder?.certificates)}
                onMove={reorder?.certificates}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <p className="font-medium">{item.title || "Title"}</p>
                  <p className="text-[11px] text-neutral-500">{item.period}</p>
                </div>
                <p className="text-neutral-600">{item.place}</p>
                {item.detail ? <p className="mt-1 text-neutral-700">{item.detail}</p> : null}
                {item.href ? (
                  <p className="mt-1 text-[11px] text-neutral-500 break-all">{item.href}</p>
                ) : null}
              </SortableRow>
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
            {resumeProjects.map((project, index) => (
              <SortableRow
                key={project.id}
                index={index}
                keepId={`project-${project.id}`}
                spacer={spacers[`project-${project.id}`] ?? 0}
                enabled={Boolean(reorder?.projects)}
                onMove={reorder?.projects}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <p className="font-medium">{project.title || "Title"}</p>
                  {project.stack.length > 0 ? (
                    <p className="text-[11px] text-neutral-500">{project.stack.join(" · ")}</p>
                  ) : null}
                </div>
                {project.description ? (
                  <p className="mt-1 text-neutral-700">{project.description}</p>
                ) : null}
              </SortableRow>
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

    const push = pageBottom - targetTop + pageInsetTop;
    if (push <= 0.5) continue;
    next[targetKey] = (next[targetKey] ?? 0) + push;
    extra += push;
    pageBottom += pageHeight;
  }

  return next;
}

/** Fixed A4 canvas so studio preview and public /resume paginate identically. */
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = Math.round((A4_WIDTH_PX * 297) / 210);

export function ResumePreview({
  draft,
  focusSection,
  reorder,
}: {
  draft: ResumeDraft;
  focusSection?: string;
  /** When set, studio uses a continuous scroll preview with drag handles. */
  reorder?: ResumeReorderHandlers;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX);
  const [spacers, setSpacers] = useState<Record<string, number>>({});
  const studioMode = Boolean(reorder);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const width = frame.clientWidth;
      if (width <= 0) return;
      setScale(Math.min(1, width / A4_WIDTH_PX));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    let cancelled = false;
    let applyFrame = 0;
    let countFrame = 0;

    setSpacers({});

    applyFrame = requestAnimationFrame(() => {
      if (cancelled) return;
      const measure = measureRef.current;
      if (!measure) return;

      const next = computeSpacers(measure, A4_HEIGHT_PX);
      setSpacers((prev) => (sameSpacers(prev, next) ? prev : next));

      countFrame = requestAnimationFrame(() => {
        if (cancelled) return;
        const finalMeasure = measureRef.current;
        if (!finalMeasure) return;
        setContentHeight(finalMeasure.scrollHeight);
        setPageCount(Math.max(1, Math.ceil(finalMeasure.scrollHeight / A4_HEIGHT_PX)));
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(applyFrame);
      cancelAnimationFrame(countFrame);
    };
  }, [draft, studioMode]);

  useEffect(() => {
    if (!focusSection) return;

    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      const frameEl = frameRef.current;
      const measure = measureRef.current;
      if (!frameEl || !measure) return;

      const scrollParent = frameEl.parentElement;
      if (!scrollParent) return;

      const target = measure.querySelector<HTMLElement>(`[data-resume-key="${focusSection}"]`);
      if (!target) return;

      if (studioMode) {
        const y = target.getBoundingClientRect().top - measure.getBoundingClientRect().top;
        const top = Math.max(0, y * scale - 12);
        scrollParent.scrollTo({ top, behavior: "smooth" });
        return;
      }

      const measureTop = measure.getBoundingClientRect().top;
      const y = target.getBoundingClientRect().top - measureTop;
      const pageIndex = Math.min(
        Math.max(0, pageCount - 1),
        Math.max(0, Math.floor(y / A4_HEIGHT_PX)),
      );
      const offsetInPage = y - pageIndex * A4_HEIGHT_PX;
      const activePage = frameEl.querySelector<HTMLElement>(`[data-preview-page="${pageIndex}"]`);
      if (!activePage) return;

      const pageOffset =
        activePage.getBoundingClientRect().top -
        scrollParent.getBoundingClientRect().top +
        scrollParent.scrollTop;
      const top = Math.max(0, pageOffset + offsetInPage * scale - 12);
      scrollParent.scrollTo({ top, behavior: "smooth" });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [focusSection, pageCount, scale, studioMode]);

  return (
    <div ref={frameRef} className="relative w-full max-w-full overflow-x-hidden">
      {/* Unscaled measure host — keeps pagination independent of display width. */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 -left-[10000px] -z-10 opacity-0"
        style={{ width: A4_WIDTH_PX }}
      >
        <div ref={measureRef}>
          <ResumeBody draft={draft} spacers={spacers} />
        </div>
      </div>

      {studioMode ? (
        <div className="max-w-full" style={{ width: A4_WIDTH_PX * scale }}>
          {pageCount > 1 ? (
            <p className="mb-1.5 text-xs text-muted-foreground">
              {pageCount} pages · drag items to reorder
            </p>
          ) : (
            <p className="mb-1.5 text-xs text-muted-foreground">Drag items to reorder</p>
          )}
          <div
            className="relative overflow-hidden rounded-sm border border-border bg-white"
            style={{ width: A4_WIDTH_PX * scale, height: contentHeight * scale }}
          >
            <div
              style={{
                width: A4_WIDTH_PX,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <div className="relative">
                <ResumeBody draft={draft} spacers={spacers} reorder={reorder} />
                {Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) => (
                  <div
                    key={index}
                    aria-hidden
                    className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-neutral-300"
                    style={{ top: (index + 1) * A4_HEIGHT_PX }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="flex max-w-full flex-col"
          style={{ width: A4_WIDTH_PX * scale, gap: `${Math.max(8, 16 * scale)}px` }}
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <div key={index} data-preview-page={index}>
              {pageCount > 1 ? (
                <p className="mb-1.5 text-xs text-muted-foreground">
                  Page {index + 1} of {pageCount}
                </p>
              ) : null}
              <div
                className="relative overflow-hidden"
                style={{ width: A4_WIDTH_PX * scale, height: A4_HEIGHT_PX * scale }}
              >
                <div
                  className="overflow-hidden rounded-sm border border-border bg-white"
                  style={{
                    width: A4_WIDTH_PX,
                    height: A4_HEIGHT_PX,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <div style={{ transform: `translateY(-${index * A4_HEIGHT_PX}px)` }}>
                    <ResumeBody draft={draft} spacers={spacers} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
