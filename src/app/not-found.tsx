import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found page-shell page-shell--narrow">
      <p>404</p>
      <h1>We couldn’t find that page.</h1>
      <Link className="button button--primary" href="/collections/all">Continue shopping</Link>
    </div>
  );
}
