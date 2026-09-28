
export type ContentType = "TEXT" | "FILE" | "URL";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  isPro: boolean;
}

export interface MockItemType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  isSystem: boolean;
  isPro: boolean;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  isPinned: boolean;
  itemCount: number;
  typeIds: string[];
}

export interface MockItem {
  id: string;
  title: string;
  description: string | null;
  contentType: ContentType;
  content: string | null;
  language: string | null;
  url: string | null;
  fileName: string | null;
  fileSize: number | null;
  isFavorite: boolean;
  isPinned: boolean;
  itemTypeId: string;
  collectionIds: string[];
  tags: string[];
  createdAt: string;
  lastUsedAt: string | null;
}

export const currentUser: MockUser = {
  id: "user_1",
  name: "Daniel Smith",
  email: "demo@devstash.io",
  image: null,
  isPro: false,
};

export const itemTypes: MockItemType[] = [
  { id: "type_snippet", name: "Snippet", slug: "snippets", icon: "Code", color: "#3b82f6", isSystem: true, isPro: false },
  { id: "type_prompt", name: "Prompt", slug: "prompts", icon: "Sparkles", color: "#8b5cf6", isSystem: true, isPro: false },
  { id: "type_command", name: "Command", slug: "commands", icon: "Terminal", color: "#f97316", isSystem: true, isPro: false },
  { id: "type_note", name: "Note", slug: "notes", icon: "StickyNote", color: "#fde047", isSystem: true, isPro: false },
  { id: "type_file", name: "File", slug: "files", icon: "File", color: "#6b7280", isSystem: true, isPro: true },
  { id: "type_image", name: "Image", slug: "images", icon: "Image", color: "#ec4899", isSystem: true, isPro: true },
  { id: "type_link", name: "Link", slug: "links", icon: "Link", color: "#10b981", isSystem: true, isPro: false },
];

export const collections: MockCollection[] = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Reusable hooks, components, and rendering patterns.",
    isFavorite: true,
    isPinned: true,
    itemCount: 18,
    typeIds: ["type_snippet"],
  },
  {
    id: "col_prompts",
    name: "Prototype Prompts",
    description: "System messages and prompts for rapid prototyping.",
    isFavorite: true,
    isPinned: true,
    itemCount: 12,
    typeIds: ["type_prompt"],
  },
  {
    id: "col_python",
    name: "Python Snippets",
    description: "Data wrangling, scripts, and utility functions.",
    isFavorite: false,
    isPinned: false,
    itemCount: 9,
    typeIds: ["type_snippet"],
  },
  {
    id: "col_shell",
    name: "Shell & Git",
    description: "Terminal commands I always forget.",
    isFavorite: false,
    isPinned: false,
    itemCount: 24,
    typeIds: ["type_command"],
  },
  {
    id: "col_context",
    name: "Context Files",
    description: "Project context and AI instruction files.",
    isFavorite: false,
    isPinned: false,
    itemCount: 6,
    typeIds: ["type_file"],
  },
  {
    id: "col_reading",
    name: "Reading List",
    description: "Articles and docs to read later.",
    isFavorite: false,
    isPinned: false,
    itemCount: 14,
    typeIds: ["type_link"],
  },
  {
    id: "col_ui",
    name: "UI Inspiration",
    description: "Screenshots and design references.",
    isFavorite: true,
    isPinned: true,
    itemCount: 20,
    typeIds: ["type_image", "type_note"],
  },
];

export const items: MockItem[] = [
  {
    id: "item_use_debounce",
    title: "useDebounce",
    description: "Debounce a value in React.",
    contentType: "TEXT",
    content: `export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}`,
    language: "typescript",
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: true,
    isPinned: true,
    itemTypeId: "type_snippet",
    collectionIds: ["col_react"],
    tags: ["react", "hooks"],
    createdAt: "2026-09-20T10:00:00Z",
    lastUsedAt: "2026-09-28T08:00:00Z",
  },
  {
    id: "item_fetch_retry",
    title: "Fetch with retry",
    description: "Retry a fetch request a set number of times.",
    contentType: "TEXT",
    content: `async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try { return await fetch(url); } catch (e) { if (i === retries - 1) throw e; }
  }
}`,
    language: "typescript",
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_snippet",
    collectionIds: ["col_react"],
    tags: ["fetch", "utils"],
    createdAt: "2026-09-18T10:00:00Z",
    lastUsedAt: "2026-09-23T10:00:00Z",
  },
  {
    id: "item_code_review_prompt",
    title: "Code review prompt",
    description: "System prompt for thorough code reviews.",
    contentType: "TEXT",
    content: "You are a senior engineer. Review the following code for bugs, security issues, and readability. Be concise.",
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: true,
    isPinned: false,
    itemTypeId: "type_prompt",
    collectionIds: ["col_prompts"],
    tags: ["ai", "review"],
    createdAt: "2026-09-15T10:00:00Z",
    lastUsedAt: "2026-09-22T10:00:00Z",
  },
  {
    id: "item_git_undo",
    title: "Undo last commit",
    description: "Keep changes, remove the last commit.",
    contentType: "TEXT",
    content: "git reset --soft HEAD~1",
    language: "bash",
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: true,
    itemTypeId: "type_command",
    collectionIds: ["col_shell"],
    tags: ["git"],
    createdAt: "2026-09-10T10:00:00Z",
    lastUsedAt: "2026-09-21T10:00:00Z",
  },
  {
    id: "item_pandas_groupby",
    title: "Pandas group and sum",
    description: null,
    contentType: "TEXT",
    content: `df.groupby("category")["amount"].sum().reset_index()`,
    language: "python",
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_snippet",
    collectionIds: ["col_python"],
    tags: ["python", "pandas"],
    createdAt: "2026-09-08T10:00:00Z",
    lastUsedAt: null,
  },
  {
    id: "item_design_notes",
    title: "Dashboard design notes",
    description: "Ideas for card layouts and colors.",
    contentType: "TEXT",
    content: "Use type colors for card borders. Keep spacing generous and borders subtle.",
    language: null,
    url: null,
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_note",
    collectionIds: ["col_ui"],
    tags: ["design"],
    createdAt: "2026-09-05T10:00:00Z",
    lastUsedAt: null,
  },
  {
    id: "item_claude_md",
    title: "CLAUDE.md template",
    description: "Starter context file for AI coding assistants.",
    contentType: "FILE",
    content: null,
    language: null,
    url: null,
    fileName: "CLAUDE.md",
    fileSize: 2048,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_file",
    collectionIds: ["col_context"],
    tags: ["ai", "context"],
    createdAt: "2026-09-03T10:00:00Z",
    lastUsedAt: null,
  },
  {
    id: "item_nextjs_docs",
    title: "Next.js App Router docs",
    description: null,
    contentType: "URL",
    content: null,
    language: null,
    url: "https://nextjs.org/docs/app",
    fileName: null,
    fileSize: null,
    isFavorite: false,
    isPinned: false,
    itemTypeId: "type_link",
    collectionIds: ["col_reading"],
    tags: ["nextjs", "docs"],
    createdAt: "2026-09-01T10:00:00Z",
    lastUsedAt: null,
  },
];
