import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPolicy } from "@/lib/shopify";

type PolicyPageProps = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { handle } = await params;
  const policy = await getPolicy(handle);
  if (!policy) return { title: "Policy not found" };
  return {
    title: policy.title,
    alternates: { canonical: `/policies/${policy.handle}` },
    openGraph: { title: policy.title, url: `/policies/${policy.handle}` },
  };
}

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { handle } = await params;
  const policy = await getPolicy(handle);
  if (!policy) notFound();
  return (
    <article className="content-page page-shell page-shell--narrow">
      <h1>{policy.title}</h1>
      <div className="rich-text" dangerouslySetInnerHTML={{ __html: policy.body }} />
    </article>
  );
}
