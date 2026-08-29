import Link from "next/link";

export function Breadcrumbs({ current, collection }: { current: string; collection?: { handle: string; title: string } }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol>
        <li><Link href="/">Home</Link></li>
        {collection ? <li><Link href={`/collections/${collection.handle}`}>{collection.title}</Link></li> : null}
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
