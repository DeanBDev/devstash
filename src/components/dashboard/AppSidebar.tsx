import Link from "next/link";
import { Boxes, FolderOpen } from "lucide-react";
import SidebarCollections from "@/components/dashboard/SidebarCollections";
import SidebarTypes from "@/components/dashboard/SidebarTypes";
import SidebarUser from "@/components/dashboard/SidebarUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getFavoriteCollections, getRecentNonFavoriteCollections } from "@/lib/db/collections";
import { getSystemItemTypes } from "@/lib/db/items";
import { getCurrentUserId } from "@/lib/db/users";
import { currentUser } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

async function getSidebarData(userId: string | null) {
  if (!userId) return { types: [], favoriteCollections: [], recentCollections: [] };

  const [types, favoriteCollections, recentCollections] = await Promise.all([
    getSystemItemTypes(userId),
    getFavoriteCollections(userId),
    getRecentNonFavoriteCollections(userId, RECENT_COLLECTIONS_LIMIT),
  ]);
  return { types, favoriteCollections, recentCollections };
}

export default async function AppSidebar() {
  const { types, favoriteCollections, recentCollections } = await getSidebarData(
    await getCurrentUserId()
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="DevStash" render={<Link href="/dashboard" />}>
              <div className="flex size-5 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Boxes className="size-3.5!" />
              </div>
              <span className="font-semibold">DevStash</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarTypes types={types} />
        <SidebarCollections label="Favorite Collections" collections={favoriteCollections} />
        <SidebarCollections label="Recent Collections" collections={recentCollections} />
        <SidebarGroup className="pt-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="View all collections"
                className="text-muted-foreground"
                render={<Link href="/collections" />}
              >
                <FolderOpen />
                <span>View all collections</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <SidebarUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
