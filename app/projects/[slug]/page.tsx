import { readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let content: string;
  let frontmatter: { title?: string; description?: string; image?: string };

  try {
    const raw = await readFile(
      path.join(process.cwd(), "content/projects", `${slug}.mdx`),
      "utf-8"
    );
    const { content: mdxContent, data } = matter(raw);
    content = mdxContent;
    frontmatter = data;
  } catch {
    return <div>Project not found</div>;
  }

  return (
    <div className="container max-w-xl mx-auto relative z-20 pt-[14vh]">
      <div className="max-w-[544px] mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs hover:text-text-highlight transition-all inline-flex"
          >
            <ArrowLeft className="inline-flex mr-1 size-4" />
            Back home
          </Link>

          <h1 className="text-[28px] mt-2 text-text-highlight text-balance font-serif">
            {frontmatter.title}
          </h1>

          <p className="text-[13px] text-foreground/60 mt-2">
            {frontmatter.description}
          </p>

          <Image
            className="mt-4 rounded-xl border border-foreground/10 shadow-xl"
            src={frontmatter.image ?? "/project.png"}
            alt={frontmatter.title ?? "Project image"}
            height={300}
            width={544}
          />
        </div>

        {/* Content Section */}
        <div className="mb-6 text-[12px] blog-content">
          <MDXRemote source={content} />
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between border-t border-foreground/20 pt-3 mt-10">
          <Link href="/">
            <p className="text-[10px] text-foreground/60">NEWER</p>
            <p className="text-xs mt-1.5 inline-flex">
              <ChevronLeft className="inline-flex size-4" /> Repup
            </p>
          </Link>
          <Link href="/">
            <p className="text-[10px] text-foreground/60 text-end">OLDER</p>
            <p className="text-xs mt-1.5 inline-flex">
              Repup <ChevronRight className="inline-flex size-4" />
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
