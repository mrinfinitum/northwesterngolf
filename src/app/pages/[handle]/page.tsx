import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageSections } from "@/components/pages/page-sections";
import { PageSections } from "@/components/pages/PageSections";
import { getPage } from "@/lib/shopify";
import { metadataTitle } from "@/lib/seo";
import "../pages.css";

type ContentPageProps = {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) return { title: "Page not found" };
  const title = page.seo.title || page.title;
  const description = page.seo.description || page.bodySummary;
  return {
    title: metadataTitle(title),
    description,
    alternates: { canonical: `/pages/${page.handle}` },
    openGraph: { description, title, url: `/pages/${page.handle}` },
  };
}

export default async function ContentPage({ params, searchParams }: ContentPageProps) {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) notFound();

  const sections = pageSections[handle];
  if (sections) {
    const posted = (await searchParams).contact_posted === "true";
    return <PageSections contactPosted={posted} sections={sections} />;
  }

  return (
    <div className="nwg-page-default">
      <article className="nwg-page-default__inner">
        <h1 className="nwg-page-default__title">{page.title}</h1>
        <div className="nwg-prose" dangerouslySetInnerHTML={{ __html: page.body }} />
      </article>
    </div>
  );
}
