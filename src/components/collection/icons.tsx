import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function FiltersIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 20 14" width="20" {...props}>
      <path d="M1 2h18M1 7h18M1 12h18" stroke="currentColor" strokeLinecap="square" strokeWidth="1.5" />
      <circle cx="6" cy="2" fill="#fff" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="7" fill="#fff" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="9" cy="12" fill="#fff" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="6" viewBox="0 0 8 6" width="8" {...props}>
      <path d="m1 1.5 3 3 3-3" stroke="currentColor" strokeLinecap="square" strokeWidth="1.5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16" {...props}>
      <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function EmptyIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="48" viewBox="0 0 48 48" width="48" {...props}>
      <circle cx="24" cy="24" fill="#d1d1d1" r="19" stroke="currentColor" strokeWidth="2" />
      <path d="m10.5 37.5 27-27" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18" {...props}>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="m12.5 12.5 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}
