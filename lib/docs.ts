import fs from "fs";
import path from "path";

export interface DocMeta {
  slug: string;
  title: string;
  group: string;
  order: number;
}

export interface DocGroup {
  name: string;
  order: number;
  docs: DocMeta[];
}

// Define groups in display order.
// Files listed here appear in that order within the group.
const GROUP_CONFIG: { name: string; files: string[] }[] = [
  {
    name: "Core",
    files: [
      "architecture",
      "agent-standard",
      "mcp",
      "api",
      "operations",
    ],
  },
  {
    name: "Standards",
    files: [
      "treasury-standard",
      "trust-standard",
      "compact-permit-agent",
    ],
  },
  {
    name: "Agents",
    files: ["lido-agent", "route-agent", "hooksmith"],
  },
  {
    name: "Uniswap",
    files: [
      "uniswap.skill",
      "uniswap-api",
      "uniswap-architecture",
      "uniswap-security",
    ],
  },
  {
    name: "Lido",
    files: ["lido.skill", "lido-security", "liquidity"],
  },
  {
    name: "MoonPay",
    files: [
      "moonpay-architecture",
      "moonpay-api",
      "moonpay-ops",
      "moonpay-payroll",
      "moonpay-security",
      "moonpay-skill-catalog",
    ],
  },
  {
    name: "Integrations",
    files: ["openclaw-integration"],
  },
  {
    name: "Demo",
    files: ["demo-script"],
  },
];

function slugToTitle(slug: string): string {
  return slug
    .replace(/\./g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getTitleFromFile(filePath: string, slug: string): string {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/^#\s+(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  return slugToTitle(slug);
}

export function getDocGroups(): DocGroup[] {
  const docsDir = path.join(process.cwd(), "public", "docs");
  const groups: DocGroup[] = [];

  GROUP_CONFIG.forEach((groupDef, groupOrder) => {
    const docs: DocMeta[] = [];
    groupDef.files.forEach((fileSlug, fileOrder) => {
      const filePath = path.join(docsDir, `${fileSlug}.md`);
      if (fs.existsSync(filePath)) {
        docs.push({
          slug: fileSlug,
          title: getTitleFromFile(filePath, fileSlug),
          group: groupDef.name,
          order: fileOrder,
        });
      }
    });

    // Add any remaining files in this group that weren't explicitly listed
    // (shouldn't normally happen but keeps it safe)
    if (docs.length > 0) {
      groups.push({ name: groupDef.name, order: groupOrder, docs });
    }
  });

  return groups;
}

export function getAllSlugs(): string[] {
  const groups = getDocGroups();
  return groups.flatMap((g) => g.docs.map((d) => d.slug));
}

export function getDocContent(slug: string): string | null {
  const docsDir = path.join(process.cwd(), "public", "docs");
  const filePath = path.join(docsDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export function getFirstSlug(): string {
  const groups = getDocGroups();
  return groups[0]?.docs[0]?.slug ?? "";
}
