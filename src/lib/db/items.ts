import type { Prisma } from "@/generated/prisma/client";
import type { ContentType } from "@/generated/prisma/enums";
import { ITEM_TYPE_ORDER } from "@/lib/item-types";
import { prisma } from "@/lib/prisma";

export interface ItemSummary {
  id: string;
  title: string;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  fileName: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  // Last used, falling back to when the item was created.
  lastActivityAt: Date;
  type: { id: string; name: string; slug: string };
  tags: string[];
}

export interface ItemTypeWithCount {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
}

export interface ItemStats {
  total: number;
  favorites: number;
}

const ITEM_SUMMARY_SELECT = {
  id: true,
  title: true,
  contentType: true,
  content: true,
  url: true,
  fileName: true,
  isFavorite: true,
  isPinned: true,
  lastUsedAt: true,
  createdAt: true,
  itemType: { select: { id: true, name: true, slug: true } },
  tags: { select: { name: true }, orderBy: { name: "asc" } },
} satisfies Prisma.ItemSelect;

type ItemSummaryRow = Prisma.ItemGetPayload<{ select: typeof ITEM_SUMMARY_SELECT }>;

function toItemSummary({ itemType, tags, lastUsedAt, createdAt, ...item }: ItemSummaryRow): ItemSummary {
  return {
    ...item,
    lastActivityAt: lastUsedAt ?? createdAt,
    type: itemType,
    tags: tags.map((tag) => tag.name),
  };
}

export async function getPinnedItems(userId: string): Promise<ItemSummary[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: "desc" },
    select: ITEM_SUMMARY_SELECT,
  });
  return items.map(toItemSummary);
}

export async function getRecentItems(userId: string, limit: number): Promise<ItemSummary[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: [{ lastUsedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }],
    take: limit,
    select: ITEM_SUMMARY_SELECT,
  });
  return items.map(toItemSummary);
}

// System types with the user's item count for each, in sidebar display order.
export async function getSystemItemTypes(userId: string): Promise<ItemTypeWithCount[]> {
  const [types, counts] = await Promise.all([
    prisma.itemType.findMany({
      where: { isSystem: true },
      select: { id: true, name: true, slug: true },
    }),
    prisma.item.groupBy({ by: ["itemTypeId"], where: { userId }, _count: { _all: true } }),
  ]);

  const countByType = new Map(counts.map((row) => [row.itemTypeId, row._count._all]));
  return types
    .map((type) => ({ ...type, itemCount: countByType.get(type.id) ?? 0 }))
    .sort((a, b) => ITEM_TYPE_ORDER.indexOf(a.slug) - ITEM_TYPE_ORDER.indexOf(b.slug));
}

export async function getItemStats(userId: string): Promise<ItemStats> {
  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
}
