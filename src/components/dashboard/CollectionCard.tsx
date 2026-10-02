import Link from "next/link";
import { Heart } from "lucide-react";
import TypeIconBadge from "@/components/dashboard/TypeIconBadge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ITEM_TYPE_RING_COLORS } from "@/lib/item-types";
import type { CollectionSummary } from "@/lib/db/collections";

interface CollectionCardProps {
  collection: CollectionSummary;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const { primaryType, types } = collection;

  return (
    <Link href={`/collections/${collection.id}`} className="group/collection rounded-xl">
      <Card
        className={cn(
          "h-full gap-3 px-4 transition-colors group-hover/collection:bg-accent/40",
          primaryType && ITEM_TYPE_RING_COLORS[primaryType.slug]
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{collection.name}</h3>
            <p className="text-xs text-muted-foreground">
              {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
            </p>
          </div>
          {collection.isFavorite && (
            <Heart className="size-4 shrink-0 fill-yellow-400 text-yellow-400" aria-label="Favorite" />
          )}
        </div>
        <p className="line-clamp-1 text-sm text-muted-foreground">{collection.description}</p>
        <div className="mt-auto flex gap-1.5">
          {types.map((type) => (
            <TypeIconBadge key={type.id} type={type} />
          ))}
        </div>
      </Card>
    </Link>
  );
}
