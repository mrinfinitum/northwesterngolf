import Link from "next/link";
import "./pages/pages.css";

export default function NotFound() {
  return (
    <div className="nwg-not-found">
      <div className="nwg-not-found__content">
        <h1>Page not found</h1>
        <Link href="/collections/all">Continue shopping</Link>
      </div>
    </div>
  );
}
