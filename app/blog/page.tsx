import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBlogs } from "@/lib/blogs";
import { formatDate } from "@/lib/dates";
import { rssAlternate } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import PageShell, { BackLink } from "@/components/layout/page-shell";


export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on self-hosting, security, and whatever Michael Tilley is building.",
  alternates: { canonical: "/blog", types: rssAlternate },
};

export default function BlogIndexPage() {
  const blogs = getBlogs();

  return (
    <PageShell>
        <Reveal variant="fade-down">
          <BackLink />
        </Reveal>

        <Reveal variant="blur-up" delay={0.05}>
          <h1 className="mt-6 font-serif text-[28px] text-balance text-text-highlight">
            Blog
          </h1>
          <p className="mt-2 text-[13px] text-foreground/55">
            Notes on self-hosting, security, and whatever I&apos;m building.
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <ul className="mt-6 divide-y divide-foreground/10 border-t border-foreground/10">
            {blogs.map((blog) => (
              <li key={blog.slug}>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="group flex items-center justify-between gap-4 py-3 transition-colors hover:text-text-highlight"
                >
                  <div className="min-w-0">
                    <h2 className="truncate text-[14px] font-medium text-text-highlight">
                      {blog.title}
                    </h2>
                    <p className="mt-0.5 truncate text-[12px] text-foreground/55">
                      {blog.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden text-[11px] text-foreground/40 sm:block">
                      {formatDate(blog.publishedAt)}
                    </span>
                    <ArrowUpRight
                      className="h-3 w-3 text-foreground/30 transition-colors group-hover:text-text-highlight"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
    </PageShell>
  );
}
