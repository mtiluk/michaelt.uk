import Link from "next/link";

type Blog = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
};

function BlogItem({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group last:border-b-0 hover:bg-foreground/10 rounded-lg pt-3 block w-full transition-all"
    >
      <div className="max-w-[544px] mx-auto border-b border-foreground/10 group-hover:border-transparent group-last:border-b-0 pb-3 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[13px] font-medium text-text-highlight leading-tight">
              {blog.title}
            </h3>
            <p className="mt-1 text-[11px] text-foreground/55 truncate">
              {blog.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            <span className="text-[11px] text-foreground/30 group-hover:text-foreground/50 transition-colors">
              {blog.date}
            </span>
            <span className="text-[10px] text-foreground/25">
              {blog.readTime}
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
      <div className="w-full max-w-136 mx-auto text-center text-[10px] leading-3">
        <div className="w-full border-t border-dashed border-foreground/20" />

        <pre className="my-2 text-center text-[10px] text-foreground/20 leading-3">
{` .-.
(o o)
| O \\
|   \\
'~~~'
No blogs yet`}
        </pre>

        <div className="w-full border-b border-dashed border-foreground/20" />
      </div>
    )
  }

  return (
    <div>
      <div>
        {blogs.map((blog, i) => (
          <BlogItem key={i} blog={blog} />
        ))}
      </div>
    </div>
  );
}
