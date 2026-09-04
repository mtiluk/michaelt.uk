export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

export function formatDateRange(start: string, end: string) {
  return start === end
    ? formatDate(start)
    : `${formatDate(start)} – ${formatDate(end)}`;
}

export function getYear(value: string) {
  return new Date(value).getFullYear();
}

export function byDateDesc<T>(dateOf: (item: T) => string) {
  return (a: T, b: T) => dateOf(b).localeCompare(dateOf(a));
}
