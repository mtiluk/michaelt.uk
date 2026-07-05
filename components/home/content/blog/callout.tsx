import type { ReactNode } from "react";
import { CircleAlert, Info, Lightbulb, OctagonX, TriangleAlert, } from "lucide-react";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "tip" | "important" | "warning" | "error";

const CONFIG: Record<
  CalloutType,
  { label: string; icon: typeof Info; panel: string; accent: string }
> = {
  note: {
    label: "Note",
    icon: Info,
    panel: "border-foreground/10 bg-foreground/4",
    accent: "text-foreground/60",
  },
  tip: {
    label: "Tip",
    icon: Lightbulb,
    panel: "border-text-highlight/15 bg-text-highlight/4",
    accent: "text-text-highlight",
  },
  important: {
    label: "Important",
    icon: CircleAlert,
    panel: "border-text-highlight/20 bg-text-highlight/6",
    accent: "text-text-highlight",
  },
  warning: {
    label: "Warning",
    icon: TriangleAlert,
    panel: "border-amber-400/20 bg-amber-400/5",
    accent: "text-amber-400",
  },
  error: {
    label: "Error",
    icon: OctagonX,
    panel: "border-red-400/20 bg-red-400/5",
    accent: "text-red-400",
  },
};

export default function Callout({ type = "note", title, children, }: { type?: CalloutType; title?: string; children: ReactNode; }) {
  const { label, icon: Icon, panel, accent } = CONFIG[type];

  return (
    <aside
      role={type === "warning" || type === "error" ? "alert" : "note"}
      className={cn("my-6 rounded-xl border p-4", panel)}
    >
      <p
        className={cn(
          "mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider",
          accent,
        )}
      >
        <Icon className="h-3 w-3" aria-hidden />
        {title ?? label}
      </p>

      <div className="text-[13px] leading-relaxed text-foreground/70 [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
