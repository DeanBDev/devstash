import TopBar from "@/components/dashboard/TopBar";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-60 shrink-0 border-r bg-sidebar p-4 text-sidebar-foreground md:block">
          <h2 className="text-sm font-semibold">Sidebar</h2>
        </aside>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
