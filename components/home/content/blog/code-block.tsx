"use client";
import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CodeBlock({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const code = children as
    | React.ReactElement<{ className?: string }>
    | undefined;
  const language =
    (props as Record<string, unknown>)["data-language"] as string ??
    code?.props?.className?.replace("language-", "") ??
    "text";

  async function copy() {
    const text = preRef.current?.textContent;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  }

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-foreground/10 bg-text-highlight/4">
      <figcaption className="flex items-center justify-between border-b border-foreground/10 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className={cn(
            "flex items-center gap-1.5 text-[10px] transition-colors",
            copied
              ? "text-text-highlight"
              : "text-foreground/40 hover:text-text-highlight",
          )}
        >
          {copied ? (
            <Check className="h-3 w-3" aria-hidden />
          ) : (
            <Copy className="h-3 w-3" aria-hidden />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre
        ref={preRef}
        {...props}
        className={cn(
          "overflow-x-auto p-4 font-mono text-[12px] leading-relaxed text-foreground/80",
          className,
        )}
      >
        {children}
      </pre>
    </figure>
  );
}
