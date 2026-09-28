import { Boxes, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";

export default function TopBar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b px-4">
      <div className="flex w-56 shrink-0 items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Boxes className="size-4" />
        </div>
        <span className="font-semibold">DevStash</span>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search titles, content, tags..."
          aria-label="Search"
          className="pr-12 pl-8"
        />
        <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">⌘K</Kbd>
      </div>

      <Button className="ml-auto">
        <Plus data-icon="inline-start" />
        New item
      </Button>
    </header>
  );
}
