import type { ComponentPropsWithoutRef } from "react";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import Table, { tableComponents } from './table'
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Callout from "./callout";
import CodeBlock from "./code-block";
import Video from "./video";
import Figure from "./figure";
import Tooltip from "@/components/ui/tooltip";

export const mdxOptions: MDXRemoteProps["options"] = {
  blockJS: false,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "vesper", keepBackground: false }]],
  },
};

export const mdxComponents = {
  Callout: Callout,
  Table: Table,
  ...tableComponents,
  pre: CodeBlock,
  Video: Video,
  Figure: Figure,
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-16 mb-4 scroll-mt-24 text-[19px] font-medium leading-tight tracking-[-0.01em] text-balance text-text-highlight"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-14 mb-4 scroll-mt-24 text-[16px] font-medium leading-snug tracking-[-0.01em] text-balance text-text-highlight"
      {...props}
    />
  ),
  h4: (props: ComponentPropsWithoutRef<"h4">) => (
    <h4 className="mt-10 mb-3 scroll-mt-24 text-[14px] font-medium leading-snug text-text-highlight" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-5 text-[13px] leading-[1.85] text-pretty" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="my-5 ml-4 list-disc space-y-2 text-[13px] marker:text-foreground/30" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-[1.8] text-pretty" {...props} />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => {
    const isBlock =
      className?.includes("language-") || "data-language" in props;
    return isBlock ? (
      <code className={className} {...props} />
    ) : (
      <code className="rounded bg-foreground/10 px-1 py-0.5 text-[12px]" {...props} />
    );
  },
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const url = href ?? "";
    const isExternal = /^https?:\/\//.test(url);

    const label = isExternal ? new URL(url).hostname.replace(/^www\./, "") : url;

    return (
      <Tooltip content={label}>
        {isExternal ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-highlight decoration-foreground/60 underline underline-offset-3 transition-all hover:text-text-highlight/60"
          >
            {children}
          </a>
        ) : (
          <Link
            href={url}
            className="text-text-highlight underline underline-offset-4 hover:text-foreground"
            {...props}
          >
            {children}
          </Link>
        )}
      </Tooltip>
    );
  },
} satisfies MDXComponents;
