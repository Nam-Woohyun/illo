export function formatDate(
  value: string,
): string {
  const datePart = value.split("T")[0];

  const [year, month, day] =
    datePart.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${year}.${month}.${day}`;
}