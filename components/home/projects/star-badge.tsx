import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarBadge({ count, className }: { count: number; className?: string }) {
  return (
    <span className={cn("flex items-center gap-1 text-[#e3b341]", className)}>
      <Star className="h-3 w-3" fill="currentColor" aria-hidden />
      {count.toLocaleString()}
    </span>
  );
}
