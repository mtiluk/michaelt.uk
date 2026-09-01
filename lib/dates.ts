export function formatPublishedAt(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}
