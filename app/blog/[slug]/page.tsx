import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import getAllContent, {
  getContentBySlug,
  getSeriesContext,
} from "@/lib/content";
import { extractToc } from "@/lib/toc";
import { mdxComponents } from "@/components/home/content/mdx-components";
import TableOfContents from "@/components/home/content/table-of-contents";
import Badge from "@/components/home/badge";
import type { Blog } from "@/types/blogs";
import SeriesCard from "@/components/home/content/series-card";
import LikeButton from "@/components/home/content/like-button";
import MobileToc from "@/components/home/content/mobile-toc";
import ShareMenu from "@/components/home/content/share-menu";
import References from "@/components/home/content/references";
import { Reveal } from "@/components/ui/reveal";

const blogDirectory = path.join(process.cwd(), "content/blogs");

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getAllContent<Blog>(blogDirectory).map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getContentBySlug<Blog>(blogDirectory, slug);
  if (!blog) return {};
  return { title: blog.title, description: blog.description };
}

export default async function BlogPost({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = getContentBySlug<Blog>(blogDirectory, slug);
  if (!blog) notFound();
  const toc = extractToc(blog.content);
  const seriesCtx = getSeriesContext<Blog>(blogDirectory, slug);
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-12 px-6 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_220px]">
      <main className="w-full max-w-2xl pt-[14vh] z-10">
        <header className="mb-8 border-b border-foreground/10 pb-6">
          <Reveal variant="fade-down">
            <div className="mb-6 flex items-center justify-between">
              <Link
                href="/"
                className="group flex items-center gap-1.5 text-[12px] text-foreground/70 transition-colors hover:text-text-highlight"
              >
                <ArrowLeft
                  className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5"
                  aria-hidden
                />
                Home
              </Link>
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
              <Badge title={blog.publishedAt} />
              <Badge title={`${blog.timeToRead}`} />
            </div>
          </Reveal>
        </header>


        <Reveal variant="fade-up" delay={0.15}>
          <article>
            <MDXRemote
              source={blog.content}
              components={mdxComponents}
              options={{ mdxOptions: { rehypePlugins: [rehypeSlug] } }}
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
            <LikeButton slug={slug} />
          </Reveal>
        </div>

      </main>

      <aside className="hidden pt-[14vh] lg:block z-10">
        <Reveal
          variant="fade"
          delay={0.25}
          className="sticky top-24 max-w-55 text-[11px]"
        >
          {seriesCtx && (
            <SeriesCard
              series={seriesCtx.series}
              part={seriesCtx.part}
              total={seriesCtx.total}
              parts={seriesCtx.posts}
            />
          )}
          <TableOfContents items={toc} />
          <div className="my-5 border-t border-foreground/10" />
          <LikeButton slug={slug} />
        </Reveal>
      </aside>

      <MobileToc items={toc} />
    </div>
  );
}
