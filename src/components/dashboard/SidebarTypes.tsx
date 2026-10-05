import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SidebarCount from "@/components/dashboard/SidebarCount";
import type { ItemTypeWithCount } from "@/lib/db/items";
import { ITEM_TYPE_ICONS, ITEM_TYPE_TEXT_COLORS, PRO_ITEM_TYPE_SLUGS } from "@/lib/item-types";

interface SidebarTypesProps {
  types: ItemTypeWithCount[];
}

export default function SidebarTypes({ types }: SidebarTypesProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Types</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {types.map((type) => {
            const Icon = ITEM_TYPE_ICONS[type.slug];
            const label = `${type.name}s`;

            return (
              <SidebarMenuItem key={type.id}>
                <SidebarMenuButton
                  tooltip={label}
                  render={<Link href={`/items/${type.slug}`} />}
                >
                  {Icon && <Icon className={ITEM_TYPE_TEXT_COLORS[type.slug]} />}
                  <span>{label}</span>
                  {PRO_ITEM_TYPE_SLUGS.has(type.slug) && (
                    <Badge
                      variant="outline"
                      className="h-4 px-1.5 text-[10px] font-medium tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden"
                    >
                      PRO
                    </Badge>
                  )}
                  <SidebarCount count={type.itemCount} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
