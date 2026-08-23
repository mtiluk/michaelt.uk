import { cn } from "@/lib/utils";

export default function CardFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-foreground/20 bg-background text-xs shadow-2xl shadow-black/40",
        "max-w-[calc(100vw-2rem)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
