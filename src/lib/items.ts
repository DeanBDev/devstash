import { items, type MockItem } from "@/lib/mock-data";

// An item's last activity is when it was last used, falling back to when it was created.
export function getItemActivity(item: MockItem): number {
  return new Date(item.lastUsedAt ?? item.createdAt).getTime();
}

export function getPinnedItems(): MockItem[] {
  return items.filter((item) => item.isPinned);
}

export function getRecentItems(limit: number): MockItem[] {
  return [...items].sort((a, b) => getItemActivity(b) - getItemActivity(a)).slice(0, limit);
}
