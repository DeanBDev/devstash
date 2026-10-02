import CollectionCard from "@/components/dashboard/CollectionCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ItemCard from "@/components/dashboard/ItemCard";
import StatsCards from "@/components/dashboard/StatsCards";
import { getCollectionStats, getRecentCollections } from "@/lib/db/collections";
import { getItemStats, getPinnedItems, getRecentItems } from "@/lib/db/items";
import { getCurrentUserId } from "@/lib/db/users";

// Render per request so the dashboard reflects the current database state.
export const dynamic = "force-dynamic";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

const EMPTY_STATS = { total: 0, favorites: 0 };

async function getDashboardData(userId: string | null) {
  if (!userId) {
    return {
      recentCollections: [],
      pinnedItems: [],
      recentItems: [],
      itemStats: EMPTY_STATS,
      collectionStats: EMPTY_STATS,
    };
  }

  const [recentCollections, pinnedItems, recentItems, itemStats, collectionStats] =
    await Promise.all([
      getRecentCollections(userId, RECENT_COLLECTIONS_LIMIT),
      getPinnedItems(userId),
      getRecentItems(userId, RECENT_ITEMS_LIMIT),
      getItemStats(userId),
      getCollectionStats(userId),
    ]);
  return { recentCollections, pinnedItems, recentItems, itemStats, collectionStats };
}

export default async function DashboardPage() {
  const { recentCollections, pinnedItems, recentItems, itemStats, collectionStats } =
    await getDashboardData(await getCurrentUserId());

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your developer knowledge, organized.</p>
      </div>

      <StatsCards itemStats={itemStats} collectionStats={collectionStats} />

      <DashboardSection
        title="Recent collections"
        description="Keep your best resources close."
        viewAllHref="/collections"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </DashboardSection>

      {pinnedItems.length > 0 && (
        <DashboardSection title="Pinned items" description="Your most-used items, close at hand.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </DashboardSection>
      )}

      <DashboardSection
        title="Recent items"
        description={`${recentItems.length} recently used resources`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </DashboardSection>
    </div>
  );
}
