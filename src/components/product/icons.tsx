import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ZoomIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height="15" strokeWidth="2" viewBox="0 0 15 15" width="15" {...props}>
      <circle cx="7.067" cy="7.067" r="6.067" stroke="currentColor" />
      <path d="M11.4 11.4 14 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4v6M4 7h6" stroke="currentColor" />
    </svg>
  );
}

export function ChevronSmallIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" height="8" viewBox="0 0 5 8" width="5" {...props}>
      <path d="m.75 7 3-3-3-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" height="10" viewBox="0 0 7 10" width="7" {...props}>
      <path d="m1 9 4-4-4-4" fill="none" stroke="currentColor" strokeWidth="2" />
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

export function FaqChevronIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function OfferIcon({ icon }: { icon: "box" | "shield" | "timer" }) {
  const common = { "aria-hidden": true, fill: "none", height: 20, strokeWidth: 2, viewBox: "0 0 24 24", width: 20 } as const;
  if (icon === "timer") {
    return (
      <svg {...common}>
        <path d="M12 22.488A8.874 8.874 0 1 0 12 4.74a8.874 8.874 0 0 0 0 17.748v0Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.512 4.74a14.021 14.021 0 0 1 4.034-3.228M22.488 4.74a14.021 14.021 0 0 0-4.033-3.228M12 8.774v4.837h4.034" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (icon === "box") {
    return (
      <svg {...common}>
        <path d="M2.22 5.472a.742.742 0 0 0-.33.194.773.773 0 0 0-.175.48c-.47 4.515-.48 7.225 0 11.707a.792.792 0 0 0 .505.737l9.494 3.696.285.079.286-.08 9.494-3.694a.806.806 0 0 0 .505-.737c.5-4.537.506-7.153 0-11.648a.765.765 0 0 0-.175-.542.739.739 0 0 0-.33-.257v.002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22.269 5.997a.771.771 0 0 0-.16-.335.744.744 0 0 0-.33-.257l-9.494-3.629a.706.706 0 0 0-.571 0L6.967 3.623 2.22 5.47a.742.742 0 0 0-.33.192.771.771 0 0 0-.16.336.806.806 0 0 0 .49.592l9.494 3.696h.57l5.216-2.03L21.78 6.59a.794.794 0 0 0 .492-.593h-.002Z" fill="currentColor" fillOpacity=".12" />
        <path d="m17.5 8.255-5.215 2.03h-.571L2.22 6.59a.806.806 0 0 1-.49-.592.771.771 0 0 1 .16-.336.742.742 0 0 1 .33-.192l4.747-1.847M17.5 8.255 21.78 6.59a.794.794 0 0 0 .492-.593h-.002a.771.771 0 0 0-.16-.335.744.744 0 0 0-.33-.257l-9.494-3.629a.706.706 0 0 0-.571 0L6.967 3.623M17.5 8.255 6.967 3.623M12 22.365v-12.08M15.5 17l4-1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M1.366 11.571c0-6.337 2.658-9.054 3.546-9.96h14.177c.886.906 3.545 3.623 3.545 9.96 0 7.242-6.982 9.912-10.526 10.818-3.547-.906-10.743-3.576-10.743-10.82l.001.002Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m12 22.361.106.028c3.545-.906 10.528-3.576 10.528-10.82 0-6.335-2.657-9.05-3.544-9.958H12v20.75Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShopPayLogo(props: IconProps) {
  return (
    <svg aria-label="Shop" fill="none" role="img" viewBox="0 0 60 25" {...props}>
      <path
        d="M7.74 11.067c-2.35-.509-3.396-.708-3.396-1.612 0-.85.708-1.274 2.125-1.274 1.246 0 2.157.544 2.828 1.609.05.082.155.11.24.066l2.644-1.334a.186.186 0 0 0 .076-.259c-1.098-1.9-3.125-2.94-5.794-2.94-3.507 0-5.686 1.727-5.686 4.47 0 2.914 2.653 3.65 5.006 4.16 2.353.509 3.403.708 3.403 1.612 0 .904-.765 1.33-2.293 1.33-1.41 0-2.457-.644-3.09-1.896a.185.185 0 0 0-.25-.082L.916 16.222a.188.188 0 0 0-.082.253c1.046 2.102 3.194 3.284 6.062 3.284 3.653 0 5.86-1.697 5.86-4.526 0-2.83-2.666-3.65-5.015-4.16v-.006ZM21.909 5.324c-1.5 0-2.824.53-3.776 1.476a.093.093 0 0 1-.158-.067V.7a.185.185 0 0 0-.187-.186H14.48a.185.185 0 0 0-.187.186v18.728c0 .105.083.187.187.187h3.308a.185.185 0 0 0 .187-.187v-8.215c0-1.586 1.217-2.803 2.859-2.803 1.641 0 2.83 1.191 2.83 2.803v8.215c0 .105.082.187.187.187h3.308a.185.185 0 0 0 .186-.187v-8.215c0-3.451-2.264-5.888-5.436-5.888ZM34.056 4.786c-1.796 0-3.478.55-4.687 1.344a.187.187 0 0 0-.06.25l1.458 2.487c.054.089.168.12.256.066a5.812 5.812 0 0 1 3.04-.834c2.887 0 5.01 2.035 5.01 4.725 0 2.292-1.7 3.99-3.853 3.99-1.755 0-2.973-1.022-2.973-2.463 0-.825.351-1.501 1.265-1.979a.183.183 0 0 0 .073-.259L32.21 9.787a.186.186 0 0 0-.224-.08c-1.844.683-3.137 2.327-3.137 4.533 0 3.338 2.66 5.829 6.369 5.829 4.333 0 7.448-3 7.448-7.302 0-4.611-3.624-7.98-8.609-7.98ZM52.342 5.295c-1.673 0-3.169.62-4.26 1.707a.092.092 0 0 1-.158-.066V5.627a.185.185 0 0 0-.186-.186h-3.223a.185.185 0 0 0-.187.186v18.7c0 .104.082.186.187.186h3.308a.185.185 0 0 0 .187-.187v-6.131c0-.083.098-.124.158-.07 1.088 1.012 2.527 1.602 4.174 1.602 3.88 0 6.907-3.138 6.907-7.216 0-4.077-3.03-7.216-6.907-7.216Zm-.626 11.265c-2.207 0-3.88-1.754-3.88-4.074s1.67-4.074 3.88-4.074 3.877 1.726 3.877 4.074c0 2.349-1.644 4.074-3.88 4.074h.003Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InfoCircleIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" {...props}>
      <path d="M10 7.25c-.69 0-1.25.56-1.25 1.25a.75.75 0 0 1-1.5 0 2.75 2.75 0 1 1 3.758 2.56.61.61 0 0 0-.226.147.154.154 0 0 0-.032.046.75.75 0 0 1-1.5-.003c0-.865.696-1.385 1.208-1.586A1.25 1.25 0 0 0 10 7.25Z" fillRule="evenodd" />
      <path d="M10 14.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      <path d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" fillRule="evenodd" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg aria-hidden="true" style={{ overflow: "visible" }} viewBox="0 0 14.6 14" {...props}>
      <path d="M3.34 13.86c-.48.3-.76.1-.63-.44l1.08-4.56L.26 5.82c-.42-.36-.32-.7.24-.74l4.63-.37L6.92.39c.2-.52.55-.52.76 0l1.8 4.32 4.62.37c.56.05.67.37.24.74l-3.53 3.04 1.08 4.56c.13.54-.14.74-.63.44L7.3 11.43l-3.96 2.43z" fill="currentColor" />
    </svg>
  );
}
