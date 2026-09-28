import { getItemActivity } from "@/lib/items";
import { collections, items, type MockCollection } from "@/lib/mock-data";

export function getFavoriteCollections(): MockCollection[] {
  return collections.filter((collection) => collection.isFavorite);
}

// Most recent activity is the latest activity of any item in the collection.
function getLastActivity(collectionId: string): number {
  return items
    .filter((item) => item.collectionIds.includes(collectionId))
    .reduce((latest, item) => Math.max(latest, getItemActivity(item)), 0);
}

export function getCollectionsByRecentActivity(): MockCollection[] {
  return collections
    .map((collection) => ({ collection, lastActivity: getLastActivity(collection.id) }))
    .sort((a, b) => b.lastActivity - a.lastActivity)
    .map(({ collection }) => collection);
}

export function getRecentCollections(limit: number): MockCollection[] {
  return getCollectionsByRecentActivity()
    .filter((collection) => !collection.isFavorite)
    .slice(0, limit);
}
