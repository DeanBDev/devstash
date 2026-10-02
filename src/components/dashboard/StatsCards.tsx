import { FolderHeart, Heart, Layers, Package, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { CollectionStats } from "@/lib/db/collections";
import type { ItemStats } from "@/lib/db/items";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClassName: string;
}

interface StatsCardsProps {
  itemStats: ItemStats;
  collectionStats: CollectionStats;
}

function getStats({ itemStats, collectionStats }: StatsCardsProps): Stat[] {
  return [
    {
      label: "Items",
      value: itemStats.total,
      icon: Package,
      colorClassName: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Collections",
      value: collectionStats.total,
      icon: Layers,
      colorClassName: "bg-violet-500/10 text-violet-500",
    },
    {
      label: "Favorite items",
      value: itemStats.favorites,
      icon: Heart,
      colorClassName: "bg-rose-500/10 text-rose-500",
    },
    {
      label: "Favorite collections",
      value: collectionStats.favorites,
      icon: FolderHeart,
      colorClassName: "bg-yellow-400/10 text-yellow-400",
    },
  ];
}

export default function StatsCards(props: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {getStats(props).map(({ label, value, icon: Icon, colorClassName }) => (
        <Card key={label} className="flex-row items-center gap-3 px-4">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              colorClassName
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tabular-nums">{value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
