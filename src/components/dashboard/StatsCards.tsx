import { FolderHeart, Heart, Layers, Package, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { collections, items } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClassName: string;
}

function getStats(): Stat[] {
  return [
    {
      label: "Items",
      value: items.length,
      icon: Package,
      colorClassName: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "Collections",
      value: collections.length,
      icon: Layers,
      colorClassName: "bg-violet-500/10 text-violet-500",
    },
    {
      label: "Favorite items",
      value: items.filter((item) => item.isFavorite).length,
      icon: Heart,
      colorClassName: "bg-rose-500/10 text-rose-500",
    },
    {
      label: "Favorite collections",
      value: collections.filter((collection) => collection.isFavorite).length,
      icon: FolderHeart,
      colorClassName: "bg-yellow-400/10 text-yellow-400",
    },
  ];
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {getStats().map(({ label, value, icon: Icon, colorClassName }) => (
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
