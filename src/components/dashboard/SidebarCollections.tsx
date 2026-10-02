import Link from "next/link";
import { Layers, Star } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SidebarCount from "@/components/dashboard/SidebarCount";
import { cn } from "@/lib/utils";
import type { CollectionSummary } from "@/lib/db/collections";
import { ITEM_TYPE_DOT_COLORS } from "@/lib/item-types";

interface SidebarCollectionsProps {
  label: string;
  collections: CollectionSummary[];
}

// Favorites show a star; other collections show a dot in their most-used type's color.
function CollectionIndicator({ collection }: { collection: CollectionSummary }) {
  if (collection.isFavorite) {
    return <Star className="fill-yellow-400 text-yellow-400 group-data-[collapsible=icon]:hidden" />;
  }
  if (!collection.primaryType) return null;

  return (
    <span
      title={collection.primaryType.name}
      className={cn(
        "size-2 shrink-0 rounded-full group-data-[collapsible=icon]:hidden",
        ITEM_TYPE_DOT_COLORS[collection.primaryType.slug]
      )}
    />
  );
}

export default function SidebarCollections({ label, collections }: SidebarCollectionsProps) {
  if (collections.length === 0) return null;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {collections.map((collection) => (
            <SidebarMenuItem key={collection.id}>
              <SidebarMenuButton
                tooltip={collection.name}
                render={<Link href={`/collections/${collection.id}`} />}
              >
                <Layers />
                <span>{collection.name}</span>
                <SidebarCount count={collection.itemCount} />
                <CollectionIndicator collection={collection} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
