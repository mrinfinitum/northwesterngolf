import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults = {
  "aria-hidden": true,
  fill: "none",
  height: 24,
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.7,
  viewBox: "0 0 24 24",
  width: 24,
};

export function MenuIcon(props: IconProps) {
  return <svg {...defaults} height={22} strokeWidth={2} viewBox="0 0 22 22" width={22} {...props}><path d="M1 5h20M1 11h20M1 17h20" /></svg>;
}

export function CloseIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path d="m5 5 14 14M19 5 5 19" /></svg>;
}

export function SearchIcon(props: IconProps) {
  return <svg {...defaults} height={22} strokeWidth={2} viewBox="0 0 22 22" width={22} {...props}><circle cx="11" cy="10" r="7" /><path d="m16 15 3 3" /></svg>;
}

export function AccountIcon(props: IconProps) {
  return <svg {...defaults} height={22} strokeWidth={2} viewBox="0 0 22 22" width={22} {...props}><circle cx="11" cy="7" r="4" /><path d="M3.5 19c1.421-2.974 4.247-5 7.5-5s6.079 2.026 7.5 5" /></svg>;
}

export function BagIcon(props: IconProps) {
  return <svg {...defaults} height={22} strokeWidth={2} viewBox="0 0 22 22" width={22} {...props}><path d="M11 7H3.577A2 2 0 0 0 1.64 9.497l2.051 8A2 2 0 0 0 5.63 19H16.37a2 2 0 0 0 1.937-1.503l2.052-8A2 2 0 0 0 18.422 7H11Zm0 0V1" /></svg>;
}

export function ChevronDownIcon(props: IconProps) {
  return <svg {...defaults} fill="none" strokeWidth={2} viewBox="0 0 10 7" {...props}><path d="m1 1 4 4 4-4" /></svg>;
}

export function ChevronLeftIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path d="m15 18-6-6 6-6" /></svg>;
}

export function ChevronRightIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path d="m9 18 6-6-6-6" /></svg>;
}

export function InstagramIcon(props: IconProps) {
  return <svg {...defaults} {...props}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg>;
}

export function FacebookIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path d="M14 8h4V3h-4a6 6 0 0 0-6 6v3H4v5h4v4h5v-4h4l1-5h-5V9a1 1 0 0 1 1-1Z" /></svg>;
}

export function TikTokIcon(props: IconProps) {
  return <svg {...defaults} {...props}><path d="M15 4c.7 2 2 3.2 4 3.5V11a8.8 8.8 0 0 1-4-1.2v5.7a5.5 5.5 0 1 1-5.5-5.5c.5 0 1 0 1.5.2v3.6a2.5 2.5 0 1 0 .5 1.7V3H15v1Z" /></svg>;
}
