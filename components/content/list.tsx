export default function List({
  items = [],
  ordered = false,
  variant = "default",
  title = "",
}: {
  items?: string[];
  ordered?: boolean;
  variant?: "default" | "checklist" | "minimal";
  title?: string;
}) {
  if (!items.length) return null;
  const Tag = ordered ? "ol" : "ul";

  console.log("Example");

  return (
    <div>
      Example
      <Tag>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </Tag>
    </div>
  );
}
