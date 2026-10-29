import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle } from "@/lib/shopify";
import { metadataTitle } from "@/lib/seo";
import "../../blogs.css";

type ArticlePageProps = { params: Promise<{ article: string; blog: string }> };

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { article: handle, blog } = await params;
  const article = await getArticle(blog, handle);
  if (!article) return { title: "Article not found" };
  const title = article.seo.title || article.title;
  const description = article.seo.description || article.excerpt || undefined;
  const url = `/blogs/${article.blog.handle}/${article.handle}`;
  return {
    title: metadataTitle(title),
    description,
    alternates: { canonical: url },
    openGraph: {
      description,
      images: article.image ? [article.image.url] : undefined,
      title,
      type: "article",
      url,
    },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { article: handle, blog } = await params;
  const article = await getArticle(blog, handle);
  if (!article) notFound();

  return (
    <article className="nwg-article">
      <header className="nwg-article__header">
        <Link href={`/blogs/${article.blog.handle}`}>{article.blog.title}</Link>
        <h1>{article.title}</h1>
        <p>
          <time dateTime={article.publishedAt}>
            {dateFormat.format(new Date(article.publishedAt))}
          </time>
          {article.authorV2 ? ` · ${article.authorV2.name}` : null}
        </p>
      </header>
      {article.image ? (
        <Image
          alt={article.image.altText ?? article.title}
          className="nwg-article__image"
          height={article.image.height ?? 800}
          priority
          sizes="(min-width: 1000px) 1000px, 100vw"
          src={article.image.url}
          width={article.image.width ?? 1200}
        />
      ) : null}
      <div className="nwg-article__body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
    </article>
  );
}
