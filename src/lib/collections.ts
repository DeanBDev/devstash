import { collections, items, type MockCollection } from "@/lib/mock-data";

export function getFavoriteCollections(): MockCollection[] {
  return collections.filter((collection) => collection.isFavorite);
}

// Most recent activity is the latest lastUsedAt/createdAt of any item in the collection.
function getLastActivity(collectionId: string): number {
  return items
    .filter((item) => item.collectionIds.includes(collectionId))
    .reduce((latest, item) => {
      const time = new Date(item.lastUsedAt ?? item.createdAt).getTime();
      return Math.max(latest, time);
    }, 0);
}

export function getRecentCollections(limit: number): MockCollection[] {
  return collections
    .filter((collection) => !collection.isFavorite)
    .map((collection) => ({ collection, lastActivity: getLastActivity(collection.id) }))
    .sort((a, b) => b.lastActivity - a.lastActivity)
    .slice(0, limit)
    .map(({ collection }) => collection);
}
