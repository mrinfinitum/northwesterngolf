import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageSections } from "@/components/pages/page-sections";
import { PageSections } from "@/components/pages/PageSections";
import { PrivacyChoices } from "@/components/privacy/PrivacyChoices";
import { noindexPageHandles } from "@/config/site";
import { getPage } from "@/lib/shopify";
import { sanitizeShopifyHtml } from "@/lib/sanitize";
import { PRIVACY_CHOICES_PATH } from "@/lib/privacy";
import { isThinPage, metadataTitle, openGraphBase } from "@/lib/seo";
import "../pages.css";

/** Descriptions for designed (image-led) Shopify pages that have no body text or SEO description. */
const fallbackDescriptions: Record<string, string> = {
  "talon-ss":
    "The Talon SS Full Set from Northwestern Golf: a forgiving, easy-launching complete set with a stand bag for men, women and seniors. See the set and the current John Daly Signature Sets.",
};

/** Where customer-account opt-out requests go (the store's support inbox). */
const PRIVACY_EMAIL = "info@northwestern.golf";

type ContentPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) return { title: "Page not found" };
  const title = page.seo.title || page.title;
  const description = page.seo.description || page.bodySummary || fallbackDescriptions[page.handle] || undefined;
  return {
    title: metadataTitle(title),
    description,
    alternates: { canonical: `/pages/${page.handle}` },
    openGraph: { ...openGraphBase, description, title, url: `/pages/${page.handle}` },
    robots: noindexPageHandles.has(page.handle) || isThinPage(page.handle, page.bodySummary) ? { follow: true, index: false } : undefined,
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) notFound();

  const sections = pageSections[handle];
  if (sections) {
    return <PageSections sections={sections} title={page.title} />;
  }

  const isPrivacyChoices = `/pages/${page.handle}` === PRIVACY_CHOICES_PATH;
  let body = sanitizeShopifyHtml(page.body);
  // Shopify's opt-out form is a container its own script fills in; that script can't run
  // here (innerHTML never runs scripts, and the CSP blocks it), so render our own control.
  if (isPrivacyChoices) body = body.replace(/<div id="pc--optOutFormContainer"[^>]*>[\s\S]*?<\/div>/, "");

  return (
    <div className="nwg-page-default">
      <article className="nwg-page-default__inner">
        <h1 className="nwg-page-default__title">{page.title}</h1>
        <div className="nwg-prose" dangerouslySetInnerHTML={{ __html: body }} />
        {isPrivacyChoices ? <PrivacyChoices email={PRIVACY_EMAIL} /> : null}
      </article>
    </div>
  );
}
