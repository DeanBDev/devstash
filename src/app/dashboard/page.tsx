import CollectionCard from "@/components/dashboard/CollectionCard";
import DashboardSection from "@/components/dashboard/DashboardSection";
import ItemCard from "@/components/dashboard/ItemCard";
import StatsCards from "@/components/dashboard/StatsCards";
import { getCollectionStats, getRecentCollections } from "@/lib/db/collections";
import { getCurrentUserId } from "@/lib/db/users";
import { getPinnedItems, getRecentItems } from "@/lib/items";

// Render per request so the dashboard reflects the current database state.
export const dynamic = "force-dynamic";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  const [recentCollections, collectionStats] = userId
    ? await Promise.all([
        getRecentCollections(userId, RECENT_COLLECTIONS_LIMIT),
        getCollectionStats(userId),
      ])
    : [[], { total: 0, favorites: 0 }];
  const pinnedItems = getPinnedItems();
  const recentItems = getRecentItems(RECENT_ITEMS_LIMIT);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your developer knowledge, organized.</p>
      </div>

      <StatsCards collectionStats={collectionStats} />

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
