import Link from "next/link";

const icons = {
  cart: (
    <svg aria-hidden="true" fill="none" viewBox="0 0 22 22">
      <path
        d="M11 7H3.577A2 2 0 0 0 1.64 9.497l2.051 8A2 2 0 0 0 5.63 19H16.37a2 2 0 0 0 1.937-1.503l2.052-8A2 2 0 0 0 18.422 7H11Zm0 0V1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  comment: (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M6.903 2.822A10.442 10.442 0 1 1 8.4 21.477l-5.709.95a.857.857 0 0 1-.953-1.118l1.46-4.356A10.442 10.442 0 0 1 6.904 2.822v0Z"
        fill="currentColor"
        fillOpacity=".12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.251 9.429h8.357M8.251 14.571h6.32" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/** The live Impact theme's full-page empty state (empty cart, empty blog). */
export function EmptyState({
  actionHref,
  actionLabel,
  count,
  icon,
  title,
}: {
  actionHref: string;
  actionLabel: string;
  count?: number;
  icon: keyof typeof icons;
  title: string;
}) {
  return (
    <div className="nwg-empty-state">
      <div className="nwg-empty-state__icon">
        {icons[icon]}
        {count === undefined ? null : <span>{count}</span>}
      </div>
      <h1>{title}</h1>
      <Link className="button nwg-empty-state__button" href={actionHref}>{actionLabel}</Link>
    </div>
  );
}
