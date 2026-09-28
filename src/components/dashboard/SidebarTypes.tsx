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
import { ITEM_TYPE_ICONS, ITEM_TYPE_TEXT_COLORS } from "@/lib/item-types";
import { itemTypes, items } from "@/lib/mock-data";

function getItemCount(typeId: string): number {
  return items.filter((item) => item.itemTypeId === typeId).length;
}

export default function SidebarTypes() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Types</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {itemTypes.map((type) => {
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
                  <SidebarCount count={getItemCount(type.id)} />
                  {type.isPro && (
                    <Badge variant="secondary" className="group-data-[collapsible=icon]:hidden">
                      Pro
                    </Badge>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
