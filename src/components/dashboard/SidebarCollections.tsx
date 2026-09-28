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
import type { MockCollection } from "@/lib/mock-data";

interface SidebarCollectionsProps {
  label: string;
  collections: MockCollection[];
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
                {collection.isFavorite && (
                  <Star className="fill-yellow-400 text-yellow-400 group-data-[collapsible=icon]:hidden" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
