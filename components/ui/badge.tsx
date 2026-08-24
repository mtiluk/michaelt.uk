export default function Badge({ title }: { title: string }) {
  return (
    <div className="inline-flex overflow-hidden rounded bg-text-highlight/4 px-2 py-0.5 text-[11px] text-text-highlight/40 whitespace-nowrap">
      {title}
    </div>
  );
}
