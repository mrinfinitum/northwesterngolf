import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OurStory } from "@/components/content/OurStory";
import { getPage } from "@/lib/shopify";
import { metadataTitle } from "@/lib/seo";

type ContentPageProps = { params: Promise<{ handle: string }> };

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

export default async function ContentPage({ params }: ContentPageProps) {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) notFound();
  if (handle === "our-story") return <OurStory />;

  return (
    <article className="content-page page-shell page-shell--narrow">
      <h1>{page.title}</h1>
      <div className="rich-text" dangerouslySetInnerHTML={{ __html: page.body }} />
    </article>
  );
}
