export function formatEventDate(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return {
    month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
    day: String(d.getDate()).padStart(2, "0"),
    year: d.getFullYear(),
    time: d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
  };
}
