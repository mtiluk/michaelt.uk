import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBlog, getBlogs, getSeriesContext } from "@/lib/blogs";
import { extractToc } from "@/lib/toc";
import { mdxComponents, mdxOptions } from "@/components/article/mdx-components";
import TableOfContents from "@/components/article/table-of-contents";
import Badge from "@/components/ui/badge";
import SeriesCard from "@/components/article/series-card";
import LikeButton from "@/components/article/like-button";
import MobileToc from "@/components/article/mobile-toc";
import { DesktopOnly, MobileOnly } from "@/components/article/breakpoint";
import ShareMenu from "@/components/article/share-menu";
import { BackLink } from "@/components/layout/page-shell";
import References from "@/components/article/references";
import { Reveal } from "@/components/ui/reveal";
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
  const toc = extractToc(blog.content);
  const seriesCtx = getSeriesContext(slug);
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-12 px-6 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_220px]">
      <JsonLd
        data={blogPostingSchema({
          title: blog.title,
          description: blog.description,
          path: `/blog/${slug}`,
          datePublished: blog.publishedAt,
        })}
      />
      <main className="w-full max-w-2xl pt-[14vh] z-10">
        <header className="mb-8 border-b border-foreground/10 pb-6">
          <Reveal variant="fade-down">
            <div className="mb-6 flex items-center justify-between">
              <BackLink />
              <ShareMenu title={blog.title} />
            </div>
          </Reveal>

          <Reveal variant="blur-up" delay={0.05}>
            <h1 className="font-serif text-[28px] text-balance text-text-highlight">
              {blog.title}
            </h1>
          </Reveal>

          <Reveal variant="fade" delay={0.1}>
            <p className="text-xs leading-6 my-2">{blog.description}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-foreground/60">
              <Badge title={formatDate(blog.publishedAt)} />
              <Badge title={`${blog.timeToRead}`} />
            </div>
          </Reveal>
        </header>


        <Reveal variant="fade-up" delay={0.15}>
          <article>
            <MDXRemote
              source={blog.content}
              components={mdxComponents}
              options={mdxOptions}
            />
          </article>
        </Reveal>

        <Reveal inView>
          <References content={blog.content} manual={blog.references} />
        </Reveal>

        <div className="mt-12 lg:hidden">
          <Reveal inView variant="fade">
            {seriesCtx && (
              <SeriesCard
                series={seriesCtx.series}
                part={seriesCtx.part}
                total={seriesCtx.total}
                parts={seriesCtx.posts}
              />
            )}
            <div className="my-5 border-t border-foreground/10" />
            <MobileOnly>
              <LikeButton slug={slug} />
            </MobileOnly>
          </Reveal>
        </div>

      </main>

      <aside className="hidden pt-[14vh] lg:block z-10">
        <Reveal variant="fade" delay={0.25} className="sticky top-24 max-w-55 text-[11px]" >
          {seriesCtx && (
            <SeriesCard
              series={seriesCtx.series}
              part={seriesCtx.part}
              total={seriesCtx.total}
              parts={seriesCtx.posts}
            />
          )}
          <DesktopOnly>
            <TableOfContents items={toc} />
            <div className="my-5 border-t border-foreground/10" />
            <LikeButton slug={slug} />
          </DesktopOnly>
        </Reveal>
      </aside>

      <MobileOnly>
        <MobileToc items={toc} />
      </MobileOnly>
    </div>
  );
}
