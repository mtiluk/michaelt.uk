import Link from "next/link";

type Blog = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
};

const blogs: Blog[] = [
  {
    slug: "building-a-design-system",
    title: "Building a design system from scratch",
    description: "How I approached building a consistent design system for a growing product.",
    date: "Mar 2026",
    readTime: "5 min",
  },
  {
    slug: "next-js-performance",
    title: "Next.js performance patterns I actually use",
    description: "A practical look at the optimisations that made a real difference.",
    date: "Jan 2026",
    readTime: "8 min",
  },
  {
    slug: "on-simplicity",
    title: "On simplicity in software",
    description: "Why I keep coming back to doing less, better.",
    date: "Nov 2025",
    readTime: "3 min",
  },
];

function BlogItem({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group last:border-b-0 hover:bg-foreground/10 rounded-lg pt-3 block w-full transition-all"
    >
      <div className="max-w-[544px] mx-auto border-b border-foreground/10 group-hover:border-transparent group-last:border-b-0 pb-3 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-[14px] font-medium text-text-highlight leading-tight">
              {blog.title}
            </h3>
            <p className="mt-0.5 text-[13px] text-foreground/55 truncate">
              {blog.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            <span className="text-[12px] text-foreground/30 group-hover:text-foreground/50 transition-colors">
              {blog.date}
            </span>
            <span className="text-[11px] text-foreground/25">
              {blog.readTime}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Blogs() {
  return (
    <div>
      {blogs.map((blog, i) => (
        <BlogItem key={i} blog={blog} />
      ))}
    </div>
  );
}
