#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import manifest from "./generated/manifest.json" with { type: "json" };

interface LoomiComponentDoc {
  name: string;
  package: string;
  tag: string;
  category: string;
  description: string;
  docUri: string;
  markdown: string;
}

const components = manifest.components as LoomiComponentDoc[];

function find(name: string): LoomiComponentDoc | undefined {
  const q = name
    .trim()
    .toLowerCase()
    .replace(/^<|>$/g, "")
    .replace(/^loomi-/, "");
  return components.find(
    (c) => c.name === q || c.tag.toLowerCase() === `<loomi-${q}>` || c.package === `@loomidev/${q}`,
  );
}

function listingFor(list: LoomiComponentDoc[]): string {
  if (list.length === 0) return "No matching components.";
  const byCategory = new Map<string, LoomiComponentDoc[]>();
  for (const c of list) byCategory.set(c.category, [...(byCategory.get(c.category) ?? []), c]);
  const order = ["standalone", "forms", "content", "navigation"];
  const lines: string[] = [];
  for (const cat of order) {
    const items = byCategory.get(cat);
    if (!items?.length) continue;
    lines.push(`\n## ${cat[0].toUpperCase()}${cat.slice(1)}\n`);
    for (const c of items) {
      lines.push(`- **${c.tag}** — \`${c.package}\` — ${c.docUri}\n  ${c.description}`);
    }
  }
  return lines.join("\n").trim();
}

const server = new McpServer(
  { name: "loomi", version: "0.1.0" },
  {
    instructions:
      "This server exposes documentation for loomi, a framework-agnostic Lit web component " +
      "library themeable via CSS custom properties. Use list_components to discover all " +
      "available components, get_component_docs for a component's full usage docs and " +
      "attribute table, and search_components to find components by keyword. Resources are " +
      "also available at loomi://docs/<component> for direct reads.",
  },
);

for (const c of components) {
  server.registerResource(
    c.name,
    c.docUri,
    {
      title: c.tag,
      description: c.description,
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: c.markdown }],
    }),
  );
}

server.registerTool(
  "list_components",
  {
    title: "List loomi components",
    description:
      "List every available loomi component with its custom-element tag, npm package and doc URI.",
    inputSchema: {
      category: z
        .enum(["standalone", "forms", "content", "navigation"])
        .optional()
        .describe("Filter to one category. Omit to list everything."),
    },
  },
  async ({ category }) => {
    const list = category ? components.filter((c) => c.category === category) : components;
    return { content: [{ type: "text", text: listingFor(list) }] };
  },
);

server.registerTool(
  "search_components",
  {
    title: "Search loomi components",
    description: "Find loomi components by keyword (matches name, tag, and description).",
    inputSchema: { query: z.string().describe('Keyword to search for, e.g. "date" or "form".') },
  },
  async ({ query }) => {
    const q = query.toLowerCase();
    const matches = components.filter(
      (c) =>
        c.name.includes(q) || c.description.toLowerCase().includes(q) || c.category.includes(q),
    );
    return { content: [{ type: "text", text: listingFor(matches) }] };
  },
);

server.registerTool(
  "get_component_docs",
  {
    title: "Get loomi component docs",
    description:
      "Get the full documentation (usage examples, attribute table, events) for one loomi " +
      'component by name, e.g. "button" or "loomi-button".',
    inputSchema: {
      name: z.string().describe('Component name or tag, e.g. "button" or "<loomi-button>".'),
    },
  },
  async ({ name }) => {
    const doc = find(name);
    if (!doc) {
      return {
        content: [
          {
            type: "text",
            text: `No component named "${name}". Run list_components to see available names.`,
          },
        ],
        isError: true,
      };
    }
    return { content: [{ type: "text", text: doc.markdown }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
