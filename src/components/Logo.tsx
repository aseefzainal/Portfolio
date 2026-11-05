export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 72" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 64 36 8l22 56M24 44h24M66 12h32L66 60h32"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
