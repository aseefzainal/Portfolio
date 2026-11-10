export const timelineMonths = [
  { value: "01", label: "January", short: "Jan" },
  { value: "02", label: "February", short: "Feb" },
  { value: "03", label: "March", short: "Mar" },
  { value: "04", label: "April", short: "Apr" },
  { value: "05", label: "May", short: "May" },
  { value: "06", label: "June", short: "Jun" },
  { value: "07", label: "July", short: "Jul" },
  { value: "08", label: "August", short: "Aug" },
  { value: "09", label: "September", short: "Sep" },
  { value: "10", label: "October", short: "Oct" },
  { value: "11", label: "November", short: "Nov" },
  { value: "12", label: "December", short: "Dec" },
] as const;

export const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary",
  "Self-employed",
] as const;

export const locationTypes = ["On-site", "Hybrid", "Remote"] as const;

function monthShort(value: string) {
  return timelineMonths.find((month) => month.value === value)?.short ?? "";
}

function formatPoint(month: string, year: string) {
  const y = year.trim();
  if (!y) return "";
  const m = monthShort(month);
  return m ? `${m} ${y}` : y;
}

export function formatTimelinePeriod(input: {
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isCurrent?: boolean;
  fallback?: string;
}) {
  const start = formatPoint(input.startMonth ?? "", input.startYear ?? "");
  if (!start) return input.fallback?.trim() ?? "";

  if (input.isCurrent) return `${start} – Present`;

  const end = formatPoint(input.endMonth ?? "", input.endYear ?? "");
  if (!end) return start;
  return `${start} – ${end}`;
}

export function timelineYearOptions(span = 60) {
  const current = new Date().getFullYear();
  return Array.from({ length: span }, (_, index) => String(current - index));
}
