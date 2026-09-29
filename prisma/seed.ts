import "dotenv/config";
import { prisma } from "../src/lib/prisma";

// System types use fixed IDs so the seed is idempotent. A unique constraint can't
// enforce this because Postgres treats NULL userIds as distinct.
const SYSTEM_TYPES = [
  { id: "type_snippet", name: "Snippet", slug: "snippets", icon: "Code", color: "#3b82f6" },
  { id: "type_prompt", name: "Prompt", slug: "prompts", icon: "Sparkles", color: "#8b5cf6" },
  { id: "type_command", name: "Command", slug: "commands", icon: "Terminal", color: "#f97316" },
  { id: "type_note", name: "Note", slug: "notes", icon: "StickyNote", color: "#fde047" },
  { id: "type_file", name: "File", slug: "files", icon: "File", color: "#6b7280" },
  { id: "type_image", name: "Image", slug: "images", icon: "Image", color: "#ec4899" },
  { id: "type_link", name: "Link", slug: "links", icon: "Link", color: "#10b981" },
];

async function main() {
  for (const { id, ...type } of SYSTEM_TYPES) {
    await prisma.itemType.upsert({
      where: { id },
      update: { ...type, isSystem: true, userId: null },
      create: { id, ...type, isSystem: true },
    });
  }

  console.log(`Seeded ${SYSTEM_TYPES.length} system item types`);
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
