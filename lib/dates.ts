const SHORT_MONTHS: Record<string, string> = {
  August: "Aug",
  September: "Sep",
};

export function formatDate(value: string) {
  return new Date(value)
    .toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    .replace(/^\p{L}+/u, (month) => SHORT_MONTHS[month] ?? month);
}

export function formatDateRange(start: string, end: string) {
  return start === end
    ? formatDate(start)
    : `${formatDate(start)} – ${formatDate(end)}`;
}

export function byDateDesc<T>(dateOf: (item: T) => string) {
  return (a: T, b: T) => dateOf(b).localeCompare(dateOf(a));
}
