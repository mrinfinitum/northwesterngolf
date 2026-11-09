import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { getBlog } from "@/lib/shopify";
import { metadataTitle } from "@/lib/seo";
import "../blogs.css";

type BlogPageProps = { params: Promise<{ blog: string }> };

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { blog: handle } = await params;
  const blog = await getBlog(handle);
  if (!blog) return { title: "Blog not found" };
  const title = blog.seo.title || blog.title;
  return {
    title: metadataTitle(title),
    description: blog.seo.description ?? undefined,
    alternates: { canonical: `/blogs/${blog.handle}` },
  };
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export default async function BlogPage({ params }: BlogPageProps) {
  const { blog: handle } = await params;
  const blog = await getBlog(handle);
  if (!blog) notFound();

  if (!blog.articles.length) {
    return <EmptyState actionHref="/" actionLabel="Back to home" icon="comment" title="This blog is empty" />;
  }

  return (
    <div className="nwg-blog">
      <h1 className="nwg-blog__title">{blog.title}</h1>
      <ul className="nwg-blog__grid">
        {blog.articles.map((article) => (
          <li key={article.id}>
            <Link className="nwg-blog-card" href={`/blogs/${blog.handle}/${article.handle}`}>
              {article.image ? (
                <Image
                  alt={article.image.altText ?? article.title}
                  className="nwg-blog-card__image"
                  height={article.image.height ?? 800}
                  sizes="(min-width: 1000px) 33vw, (min-width: 700px) 50vw, 100vw"
                  src={article.image.url}
                  width={article.image.width ?? 1200}
                />
              ) : null}
              <time dateTime={article.publishedAt}>
                {dateFormat.format(new Date(article.publishedAt))}
              </time>
              <h2>{article.title}</h2>
              {article.excerpt ? <p>{article.excerpt}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
