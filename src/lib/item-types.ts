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
