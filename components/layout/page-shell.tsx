import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BackLink({ href = "/", label = "Home" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-1.5 text-[12px] text-foreground/70 transition-colors hover:text-text-highlight"
    >
      <ArrowLeft
        className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5"
        aria-hidden
      />
      {label}
    </Link>
  );
}

export default function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("container relative z-20 mx-auto max-w-xl px-5 pt-[14vh] pb-24 md:px-0", className)}>
      <div className="mx-auto max-w-136">{children}</div>
    </main>
  );
}
