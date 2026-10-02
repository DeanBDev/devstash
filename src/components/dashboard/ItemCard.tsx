import { Heart, Pin } from "lucide-react";
import TypeIconBadge from "@/components/dashboard/TypeIconBadge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/format";
import { ITEM_TYPE_RING_COLORS } from "@/lib/item-types";
import type { ItemSummary } from "@/lib/db/items";

interface ItemCardProps {
  item: ItemSummary;
}

function ItemPreview({ item }: ItemCardProps) {
  if (item.contentType === "TEXT" && item.content) {
    return (
      <pre className="line-clamp-3 overflow-hidden rounded-md bg-muted/50 p-3 font-mono text-xs whitespace-pre-wrap text-muted-foreground">
        {item.content}
      </pre>
    );
  }

  const detail = item.contentType === "URL" ? item.url : item.fileName;
  if (!detail) return null;

  return <p className="truncate font-mono text-xs text-muted-foreground">{detail}</p>;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { type } = item;

  return (
    <Card className={cn("h-full gap-3 px-4", ITEM_TYPE_RING_COLORS[type.slug])}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TypeIconBadge type={type} />
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {type.name}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {item.isPinned && <Pin className="size-3.5 text-muted-foreground" aria-label="Pinned" />}
          {item.isFavorite && (
            <Heart className="size-3.5 fill-rose-500 text-rose-500" aria-label="Favorite" />
          )}
        </div>
      </div>

      <h3 className="truncate font-semibold">{item.title}</h3>
      <ItemPreview item={item} />

      <div className="mt-auto flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatRelativeTime(item.lastActivityAt)}
        </span>
      </div>
    </Card>
  );
}
