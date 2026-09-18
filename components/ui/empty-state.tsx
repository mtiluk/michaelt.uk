import type { ReactNode } from "react";

export default function EmptyState({ message }: { message: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-136 text-center">
      <div className="w-full border-t border-dashed border-foreground/20" />
      <pre aria-hidden className="my-2 text-[10px] leading-3 text-foreground/20">
{` .-.
(o o)
| O \\
|   \\
'~~~'`}
      </pre>
      <p className="mb-2 text-[10px] text-foreground/40">{message}</p>
      <div className="w-full border-b border-dashed border-foreground/20" />
    </div>
  );
}
