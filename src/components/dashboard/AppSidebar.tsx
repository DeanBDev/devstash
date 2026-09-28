import Link from "next/link";
import { Boxes } from "lucide-react";
import SidebarCollections from "@/components/dashboard/SidebarCollections";
import SidebarTypes from "@/components/dashboard/SidebarTypes";
import SidebarUser from "@/components/dashboard/SidebarUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getFavoriteCollections, getRecentCollections } from "@/lib/collections";
import { currentUser } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

export default function AppSidebar() {
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
        <SidebarTypes />
        <SidebarCollections label="Favorite Collections" collections={getFavoriteCollections()} />
        <SidebarCollections
          label="Recent Collections"
          collections={getRecentCollections(RECENT_COLLECTIONS_LIMIT)}
        />
      </SidebarContent>

      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <SidebarUser user={currentUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
