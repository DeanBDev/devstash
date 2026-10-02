export const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
};

// System types use fixed IDs so the seed is idempotent. A unique constraint can't
// enforce this because Postgres treats NULL userIds as distinct.
export const SYSTEM_TYPES = [
  { id: "type_snippet", name: "Snippet", slug: "snippets", icon: "Code", color: "#3b82f6" },
  { id: "type_prompt", name: "Prompt", slug: "prompts", icon: "Sparkles", color: "#8b5cf6" },
  { id: "type_command", name: "Command", slug: "commands", icon: "Terminal", color: "#f97316" },
  { id: "type_note", name: "Note", slug: "notes", icon: "StickyNote", color: "#fde047" },
  { id: "type_file", name: "File", slug: "files", icon: "File", color: "#6b7280" },
  { id: "type_image", name: "Image", slug: "images", icon: "Image", color: "#ec4899" },
  { id: "type_link", name: "Link", slug: "links", icon: "Link", color: "#10b981" },
];

interface SeedItemMeta {
  isPinned?: boolean;
  isFavorite?: boolean;
  tags?: string[];
  // Sets lastUsedAt relative to seed time so "Recent items" has realistic activity.
  lastUsedHoursAgo?: number;
}

interface SeedTextItem extends SeedItemMeta {
  type: "type_snippet" | "type_prompt" | "type_command";
  title: string;
  description: string;
  content: string;
  language?: string;
}

interface SeedLinkItem extends SeedItemMeta {
  type: "type_link";
  title: string;
  description: string;
  url: string;
}

export type SeedItem = SeedTextItem | SeedLinkItem;

export interface SeedCollection {
  name: string;
  description: string;
  isFavorite?: boolean;
  items: SeedItem[];
}

export const SEED_COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
    items: [
      {
        type: "type_snippet",
        title: "useDebounce & useLocalStorage",
        description: "Custom hooks for debouncing values and persisting state.",
        language: "typescript",
        isPinned: true,
        isFavorite: true,
        tags: ["react", "hooks"],
        lastUsedHoursAgo: 1,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        type: "type_snippet",
        title: "Context provider & compound components",
        description: "Typed context provider with a compound Tabs component.",
        language: "typescript",
        tags: ["react", "typescript"],
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used inside <Tabs>");
  return context;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

Tabs.Trigger = function TabsTrigger({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function TabsPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div>{children}</div> : null;
};`,
      },
      {
        type: "type_snippet",
        title: "Utility functions",
        description: "Small helpers for class names, formatting, and grouping.",
        language: "typescript",
        content: `export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit++;
  }
  return \`\${size.toFixed(unit === 0 ? 0 : 1)} \${units[unit]}\`;
}

export function groupBy<T, K extends PropertyKey>(items: T[], getKey: (item: T) => K) {
  return items.reduce(
    (groups, item) => {
      (groups[getKey(item)] ??= []).push(item);
      return groups;
    },
    {} as Record<K, T[]>
  );
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: true,
    items: [
      {
        type: "type_prompt",
        title: "Code review",
        description: "Thorough review focused on bugs, security, and readability.",
        isPinned: true,
        isFavorite: true,
        tags: ["ai", "review"],
        lastUsedHoursAgo: 3,
        content: `You are a senior software engineer doing a code review.

Review the code below and report:
1. Bugs and logic errors (with the input that triggers them)
2. Security issues (injection, auth checks, secrets, unsafe input handling)
3. Performance problems (N+1 queries, unnecessary work, re-renders)
4. Readability and naming improvements

Rank findings by severity. For each, quote the relevant line and suggest a concrete fix. Skip style nitpicks a linter would catch.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        type: "type_prompt",
        title: "Documentation generation",
        description: "Generate clear docs and usage examples for a module.",
        content: `Write developer documentation for the module below.

Include:
- A one-paragraph overview of what it does and when to use it
- Each exported function/component: purpose, parameters, return value, and thrown errors
- One realistic usage example per export
- Any gotchas or edge cases a new developer should know

Use Markdown. Keep it concise and accurate to the code — don't invent behavior.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        type: "type_prompt",
        title: "Refactoring assistance",
        description: "Refactor for clarity without changing behavior.",
        content: `Refactor the code below to improve readability and maintainability without changing its behavior.

Constraints:
- Keep the public API and outputs identical
- Prefer small, well-named functions over comments
- Remove duplication and dead code
- Match the existing style and conventions

First list the refactorings you will make and why, then show the final code. Call out anything that would need a test to confirm behavior is unchanged.

\`\`\`
{{code}}
\`\`\``,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        type: "type_snippet",
        title: "Next.js Dockerfile",
        description: "Multi-stage Docker build for a Next.js standalone app.",
        language: "dockerfile",
        isFavorite: true,
        tags: ["docker", "nextjs"],
        lastUsedHoursAgo: 50,
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        type: "type_command",
        title: "Deploy with migrations",
        description: "Apply pending Prisma migrations, build, and start in production.",
        language: "bash",
        content: `npm ci && npx prisma migrate deploy && npm run build && npm run start`,
      },
      {
        type: "type_link",
        title: "Docker Docs",
        description: "Official Docker documentation.",
        url: "https://docs.docker.com/",
      },
      {
        type: "type_link",
        title: "GitHub Actions Docs",
        description: "CI/CD workflows with GitHub Actions.",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        type: "type_command",
        title: "Undo last commit (keep changes)",
        description: "Remove the last commit but keep its changes staged.",
        language: "bash",
        isPinned: true,
        tags: ["git"],
        lastUsedHoursAgo: 26,
        content: `git reset --soft HEAD~1`,
      },
      {
        type: "type_command",
        title: "Clean up Docker",
        description: "Remove stopped containers, unused networks, images, and build cache.",
        language: "bash",
        content: `docker system prune -a`,
      },
      {
        type: "type_command",
        title: "Kill process on a port",
        description: "Find and kill whatever is listening on port 3000.",
        language: "bash",
        tags: ["shell"],
        lastUsedHoursAgo: 5,
        content: `lsof -ti :3000 | xargs kill -9`,
      },
      {
        type: "type_command",
        title: "Check outdated packages",
        description: "List outdated npm dependencies and their latest versions.",
        language: "bash",
        content: `npm outdated`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        type: "type_link",
        title: "Tailwind CSS Docs",
        description: "Utility-first CSS framework reference.",
        url: "https://tailwindcss.com/docs",
        tags: ["css", "docs"],
        lastUsedHoursAgo: 72,
      },
      {
        type: "type_link",
        title: "shadcn/ui",
        description: "Accessible, customizable React components.",
        url: "https://ui.shadcn.com",
      },
      {
        type: "type_link",
        title: "Material Design 3",
        description: "Google's open-source design system.",
        url: "https://m3.material.io",
      },
      {
        type: "type_link",
        title: "Lucide Icons",
        description: "Open-source icon library used across DevStash.",
        url: "https://lucide.dev",
      },
    ],
  },
];
