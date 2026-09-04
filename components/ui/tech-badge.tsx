import { getTech } from "@/lib/tech";

export default function TechBadge({ name }: { name: string }) {
  const tech = getTech(name);
  const Icon = tech?.icon;

  return (
    <div className="inline-flex items-center gap-1 overflow-hidden rounded bg-text-highlight/4 px-2 py-0.5 text-[11px] text-text-highlight/40 whitespace-nowrap">
      {Icon && (
        <Icon
          className="h-3 w-3 shrink-0"
          style={tech?.color ? { color: tech.color } : undefined}
          aria-hidden
        />
      )}
      {tech?.label ?? name}
    </div>
  );
}
