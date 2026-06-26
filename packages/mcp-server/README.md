# @loomi/mcp-server

An [MCP](https://modelcontextprotocol.io) server that exposes loomi's component
documentation to AI coding tools (Claude Code, Cursor, Claude Desktop, etc.) — so the
assistant can look up real attribute tables and usage examples instead of guessing.
Mirrors the shape of BladewindUI's own MCP connector: a `list_components` /
`search_components` / `get_component_docs` tool set, plus one readable resource per
component at `loomi://docs/<name>`.

It ships every component's documentation **bundled into the package** (generated from
each component's README at build time), so it works standalone — no network access, no
local LoomiUI source checkout required.

## Install & run

```bash
npx @loomi/mcp-server
```

Or install it and point your MCP client at the binary directly:

```bash
npm install -g @loomi/mcp-server
```

## Configure in Claude Code

Add to your MCP settings (`.claude/settings.json` or via `/mcp` in an interactive
session):

```json
{
  "mcpServers": {
    "loomiui": {
      "command": "npx",
      "args": ["-y", "@loomi/mcp-server"]
    }
  }
}
```

## Configure in Cursor / Claude Desktop

Add the same shape to `~/.cursor/mcp.json` or Claude Desktop's `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "loomiui": {
      "command": "npx",
      "args": ["-y", "@loomi/mcp-server"]
    }
  }
}
```

## What it exposes

| Tool | Description |
| --- | --- |
| `list_components` | List every component (optionally filtered by `category`: `standalone` \| `forms` \| `content` \| `navigation`). |
| `search_components` | Find components by keyword (matches name, description, category). |
| `get_component_docs` | Get the full docs (usage, attribute table, events) for one component by name or tag. |

Plus one MCP **resource** per component at `loomi://docs/<name>` (e.g.
`loomi://docs/button`) for direct reads.

## Rebuilding the bundled docs

`pnpm build` runs `scripts/build-manifest.mjs`, which reads every sibling
`packages/*/README.md` in this LoomiUI source checkout and bundles them into
`src/generated/manifest.json` before compiling. Re-run it whenever a component's README
changes.
