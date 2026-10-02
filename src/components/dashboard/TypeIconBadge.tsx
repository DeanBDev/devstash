import { cn } from "@/lib/utils";
import { ITEM_TYPE_BG_COLORS, ITEM_TYPE_ICONS, ITEM_TYPE_TEXT_COLORS } from "@/lib/item-types";
interface TypeIconBadgeProps {
  type: { name: string; slug: string };
  className?: string;
}

export default function TypeIconBadge({ type, className }: TypeIconBadgeProps) {
  const Icon = ITEM_TYPE_ICONS[type.slug];
  if (!Icon) return null;

  return (
    <span
      title={type.name}
      className={cn(
        "flex size-6 items-center justify-center rounded-md",
        ITEM_TYPE_BG_COLORS[type.slug],
        ITEM_TYPE_TEXT_COLORS[type.slug],
        className
      )}
    >
      <Icon className="size-3.5" />
    </span>
  );
}
