import type { ComponentPropsWithoutRef } from "react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import List from "@/components/home/content/list";

export const mdxComponents = {
  list: List,
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
      <h2 className="mt-12 mb-3 scroll-mt-24 font-serif text-[19px] text-text-highlight" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 mb-2 scroll-mt-24 text-[15px] font-medium text-text-highlight" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-[13px] leading-relaxed my-4" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="ml-4 list-disc space-y-1 text-[13px]" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded bg-foreground/10 px-1 py-0.5 text-[12px]" {...props} />
  ),
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    const url = href ?? "";
    const isExternal = /^https?:\/\//.test(url);

    if (isExternal) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-highlight decoration-foreground/60 underline underline-offset-3 hover:text-text-highlight/60 transition-all"        >
          {children}
        </a>
      );
    }

    return (
      <Link
        href={url}
        className="text-text-highlight underline underline-offset-4 hover:text-foreground"
        {...props}
      >
        {children}
      </Link>
    );
  },
} satisfies MDXComponents;
