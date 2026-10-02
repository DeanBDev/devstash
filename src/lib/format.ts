const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export function formatRelativeTime(date: Date | string, now: number = Date.now()): string {
  const diff = Math.max(0, now - new Date(date).getTime());

  if (diff < HOUR) return `${Math.max(1, Math.floor(diff / MINUTE))}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < 30 * DAY) return `${Math.floor(diff / DAY)}d ago`;

  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
