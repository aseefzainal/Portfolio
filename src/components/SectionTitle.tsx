export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div data-reveal className="border-b pb-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{kicker}</p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}
