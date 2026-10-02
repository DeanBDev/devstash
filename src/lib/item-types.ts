import {
  Code,
  File,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

// Static maps keyed by type slug so Tailwind can see every class at build time.
// Colors mirror the hex values stored on each ItemType.
export const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  snippets: Code,
  prompts: Sparkles,
  commands: Terminal,
  notes: StickyNote,
  files: File,
  images: Image,
  links: Link,
};

export const ITEM_TYPE_TEXT_COLORS: Record<string, string> = {
  snippets: "text-blue-500",
  prompts: "text-violet-500",
  commands: "text-orange-500",
  notes: "text-yellow-300",
  files: "text-gray-500",
  images: "text-pink-500",
  links: "text-emerald-500",
};

export const ITEM_TYPE_RING_COLORS: Record<string, string> = {
  snippets: "ring-blue-500/50",
  prompts: "ring-violet-500/50",
  commands: "ring-orange-500/50",
  notes: "ring-yellow-300/50",
  files: "ring-gray-500/50",
  images: "ring-pink-500/50",
  links: "ring-emerald-500/50",
};

export const ITEM_TYPE_DOT_COLORS: Record<string, string> = {
  snippets: "bg-blue-500",
  prompts: "bg-violet-500",
  commands: "bg-orange-500",
  notes: "bg-yellow-300",
  files: "bg-gray-500",
  images: "bg-pink-500",
  links: "bg-emerald-500",
};

// System type display order in the sidebar.
export const ITEM_TYPE_ORDER = ["snippets", "prompts", "commands", "notes", "files", "images", "links"];

export const PRO_ITEM_TYPE_SLUGS = new Set(["files", "images"]);

export const ITEM_TYPE_BG_COLORS: Record<string, string> = {
  snippets: "bg-blue-500/10",
  prompts: "bg-violet-500/10",
  commands: "bg-orange-500/10",
  notes: "bg-yellow-300/10",
  files: "bg-gray-500/10",
  images: "bg-pink-500/10",
  links: "bg-emerald-500/10",
};
