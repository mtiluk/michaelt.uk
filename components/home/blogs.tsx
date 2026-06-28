import Link from "next/link";
import type { Blog } from "@/types/blogs";

function BlogItem({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group block w-full rounded-lg pt-3 transition-colors last:border-b-0 hover:bg-foreground/10" >
      <div className="mx-auto max-w-136 border-b border-foreground/10 pb-3 transition-colors group-hover:border-transparent group-last:border-b-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-medium leading-tight text-text-highlight">
              {blog.title}
            </h3>
            <p className="mt-1 truncate text-[11px] text-foreground/55">
              {blog.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <time dateTime={blog.publishedAt} className="text-[11px] text-foreground/30 transition-colors group-hover:text-foreground/50" >
              {blog.publishedAt}
            </time>
            <span className="text-[10px] text-foreground/25">
              {blog.timeToRead}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Blogs({ blogs }: { blogs: Blog[] }) {
  if (blogs.length === 0) {
    return (
      <div className="mx-auto w-full max-w-136 text-center">
        <div className="w-full border-t border-dashed border-foreground/20" />
        <pre
          aria-hidden
          className="my-2 text-[10px] leading-3 text-foreground/20"
        >
{` .-.
(o o)
| O \\
|   \\
'~~~'`}
        </pre>
        <p className="mb-2 text-[10px] text-foreground/40">No blogs yet</p>
        <div className="w-full border-b border-dashed border-foreground/20" />
      </div>
    );
  }

  return (
    <div>
      {blogs.map((blog) => (
        <BlogItem key={blog.slug} blog={blog} />
      ))}
    </div>
  );
}
