"use client";

import Link from "next/link";
import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { signOutAction } from "@/actions/auth";
import UserAvatar from "@/components/dashboard/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

interface SidebarUserProps {
  name: string | null;
  email: string | null;
  image: string | null;
}

export default function SidebarUser({ name, email, image }: SidebarUserProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger render={<SidebarMenuButton size="lg" tooltip="Account" />}>
            <UserAvatar name={name} email={email} image={image} className="size-8" />
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-medium">{name ?? email}</span>
              {name && <span className="truncate text-xs text-muted-foreground">{email}</span>}
            </div>
            <ChevronsUpDown className="text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-56">
            <DropdownMenuItem render={<Link href="/profile" />}>
              <User />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOutAction()}>
              <LogOut />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
