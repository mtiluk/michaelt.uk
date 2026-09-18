import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlog, getBlogs } from "@/lib/blogs";
import { mdxComponents, mdxOptions } from "@/components/article/mdx-components";
import Badge from "@/components/ui/badge";
import { BackLink } from "@/components/layout/page-shell";
import References from "@/components/article/references";
import { formatDate } from "@/lib/dates";
import { rssAlternate } from "@/lib/site";
import { blogPostingSchema } from "@/lib/schema";
import JsonLd from "@/components/seo/json-ld";


type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getBlogs().map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) return {};
  return {
    title: blog.title,
    description: blog.description,
    alternates: { canonical: `/blog/${slug}`, types: rssAlternate },
  };
}

export default async function BlogPost({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = getBlog(slug);
  if (!blog) notFound();
  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-20 sm:px-8">
      <JsonLd
        data={blogPostingSchema({
          title: blog.title,
          description: blog.description,
          path: `/blog/${slug}`,
          datePublished: blog.publishedAt,
        })}
      />
      <main className="relative z-10 w-full pt-[14vh]">
        <header className="mb-8">
            <div className="mb-6 flex items-center justify-between">
              <BackLink />
            </div>

            <h1 className="font-serif text-[30px] leading-none tracking-[-0.01em] text-balance text-text-highlight">
              {blog.title}
            </h1>

            <p className="mt-3 text-[13px] leading-[1.85] text-pretty text-foreground/70">{blog.description}</p>
            <div className="mt-3 flex items-center gap-2 text-[11px] text-foreground/60">
              <Badge title={formatDate(blog.publishedAt)} />
              <Badge title={`${blog.timeToRead}`} />
            </div>
        </header>


          <article>
            <MDXRemote
              source={blog.content}
              components={mdxComponents}
              options={mdxOptions}
            />
          </article>

          <References content={blog.content} manual={blog.references} />

      </main>
    </div>
  );
}
