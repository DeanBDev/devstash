interface SidebarCountProps {
  count: number;
}

export default function SidebarCount({ count }: SidebarCountProps) {
  return (
    <span className="ml-auto text-xs text-muted-foreground tabular-nums group-data-[collapsible=icon]:hidden">
      {count}
    </span>
  );
}
