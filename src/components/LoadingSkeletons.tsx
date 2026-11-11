import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-sm" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-8 w-14 rounded-md" />
        </div>
        <Skeleton className="size-8 rounded-md sm:hidden" />
      </div>
    </header>
  );
}

export function HeroSkeleton() {
  return (
    <section className="px-5 pt-16 pb-12 sm:pt-24 sm:pb-16">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-3 h-10 w-72 sm:h-12 sm:w-96" />
        <Skeleton className="mt-5 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-4 w-full max-w-lg" />
        <div className="mt-8 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>
    </section>
  );
}

export function AboutSkeleton() {
  return (
    <section className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-7 w-28" />
        <div className="mt-8 grid gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mt-8 grid border-t sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="border-b py-4 sm:odd:pr-6 sm:even:pl-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-2 h-3 w-40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <section className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="mt-2 h-7 w-40" />
        <div className="mt-8 space-y-6 border-t pt-6">
          {Array.from({ length: rows }, (_, index) => (
            <div key={index} className="grid gap-2 border-b pb-6 sm:grid-cols-[10.5rem_1fr] sm:gap-8">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-36" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkillsSkeleton() {
  return (
    <section className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-7 w-28" />
        <div className="mt-8 flex flex-wrap gap-2">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-20 rounded-md" />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContributionsSkeleton() {
  return (
    <section className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-7 w-28" />
        <Skeleton className="mt-8 h-28 w-full rounded-md" />
      </div>
    </section>
  );
}

export function ContactSkeleton() {
  return (
    <section className="px-5 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-7 w-28" />
        <Skeleton className="mt-4 h-4 w-full max-w-md" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-28 w-full rounded-md sm:col-span-2" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </section>
  );
}

export function AdminShellSkeleton() {
  return (
    <div className="min-h-dvh bg-background md:flex">
      <aside className="border-b border-border md:sticky md:top-0 md:flex md:h-dvh md:w-56 md:shrink-0 md:flex-col md:border-r md:border-b-0">
        <div className="flex flex-col gap-4 px-4 py-4 md:h-full md:px-3 md:py-6">
          <div className="md:px-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
          <div className="flex gap-1 md:flex-col">
            <Skeleton className="h-9 w-20 rounded-md md:w-full" />
            <Skeleton className="h-9 w-16 rounded-md md:w-full" />
            <Skeleton className="h-9 w-14 rounded-md md:w-full" />
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center justify-end gap-2 border-b border-border px-5 md:px-8">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="hidden h-4 w-24 sm:block" />
        </div>
        <main className="min-w-0 flex-1 px-5 py-8 md:px-8">
          <div className="mx-auto max-w-6xl">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="mt-2 h-4 w-72" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function ResumeStudioSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-28" />
      <Skeleton className="mt-2 h-4 w-full max-w-xl" />
      <div className="mt-6 grid gap-4 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-16 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-md" />
            <Skeleton className="h-7 w-20 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-md" />
            <Skeleton className="h-7 w-14 rounded-md" />
            <Skeleton className="h-7 w-18 rounded-md" />
          </div>
          <Skeleton className="h-16 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </div>
        <div className="min-w-0">
          <Skeleton className="mb-3 h-4 w-24" />
          <Skeleton className="aspect-[210/297] w-full rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function ShowcasePageSkeleton() {
  return (
    <main className="px-5 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-2 h-10 w-48" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-4 w-full max-w-lg" />
        <Skeleton className="mt-10 h-48 w-full rounded-md" />
      </div>
    </main>
  );
}

export function AdminFormSkeleton() {
  return (
    <div className="grid max-w-xl gap-4">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="mt-2 h-10 w-full rounded-md" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-24 w-full rounded-md" />
      <Skeleton className="h-10 w-28 rounded-md" />
    </div>
  );
}

export function AdminTableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-36" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}
