import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPolicy } from "@/lib/shopify";
import "../../pages/pages.css";

type PolicyPageProps = { params: Promise<{ handle: string }> };

/**
 * Policy bodies are authored in Shopify Admin and hard-code absolute links to
 * the myshopify domain (e.g. the policy tab row); keep shoppers on-site.
 */
function localizePolicyHtml(html: string) {
  return html
    .replace(/https?:\/\/(?:r1kikk-am\.myshopify\.com|(?:www\.)?northwestern\.golf)(\/policies\/[a-z-]+)/g, "$1")
    .replace(/class="tab-section"/g, 'class="nwg-policy-tabs"');
}

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
  // The live theme hides the policy title (the body starts with its own tabs + heading).
  return (
    <div className="nwg-page-default">
      <article className="nwg-page-default__inner">
        <h1 className="nwg-visually-hidden">{policy.title}</h1>
        <div className="nwg-prose" dangerouslySetInnerHTML={{ __html: localizePolicyHtml(policy.body) }} />
      </article>
    </div>
  );
}
