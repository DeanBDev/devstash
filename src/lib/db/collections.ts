import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export interface CollectionType {
  id: string;
  name: string;
  slug: string;
}

export interface CollectionSummary {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  // Distinct types in the collection, most-used first.
  types: CollectionType[];
  // Most-used type, falling back to the default type for empty collections.
  primaryType: CollectionType | null;
}

export interface CollectionStats {
  total: number;
  favorites: number;
}

const TYPE_SELECT = { id: true, name: true, slug: true } as const;

// Counts items per type and returns the distinct types ordered by usage.
function rankTypes(types: CollectionType[]): CollectionType[] {
  const counts = new Map<string, { type: CollectionType; count: number }>();
  for (const type of types) {
    const entry = counts.get(type.id);
    if (entry) entry.count += 1;
    else counts.set(type.id, { type, count: 1 });
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).map(({ type }) => type);
}

async function findCollectionSummaries(
  where: Prisma.CollectionWhereInput,
  limit?: number
): Promise<CollectionSummary[]> {
  const collections = await prisma.collection.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      description: true,
      isFavorite: true,
      defaultType: { select: TYPE_SELECT },
      items: { select: { item: { select: { itemType: { select: TYPE_SELECT } } } } },
    },
  });

  return collections.map(({ defaultType, items, ...collection }) => {
    const types = rankTypes(items.map(({ item }) => item.itemType));
    return {
      ...collection,
      itemCount: items.length,
      types,
      primaryType: types[0] ?? defaultType,
    };
  });
}

export function getRecentCollections(userId: string, limit: number): Promise<CollectionSummary[]> {
  return findCollectionSummaries({ userId }, limit);
}

export function getFavoriteCollections(userId: string): Promise<CollectionSummary[]> {
  return findCollectionSummaries({ userId, isFavorite: true });
}

// Recent collections for the sidebar exclude favorites, which have their own list.
export function getRecentNonFavoriteCollections(
  userId: string,
  limit: number
): Promise<CollectionSummary[]> {
  return findCollectionSummaries({ userId, isFavorite: false }, limit);
}

export async function getCollectionStats(userId: string): Promise<CollectionStats> {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
}
