# @loomidev/mcp-server

An [MCP](https://modelcontextprotocol.io) server that exposes loomi's component
documentation to MCP clients — so a connected client can look up real attribute tables
and usage examples instead of guessing. Mirrors the shape of a typical component-docs
MCP connector: a `list_components` / `search_components` / `get_component_docs` tool
set, plus one readable resource per component at `loomi://docs/<name>`.

It ships every component's documentation **bundled into the package** (generated from
each component's README at build time), so it works standalone — no network access, no
local LoomiUI source checkout required.

## Install & run

```bash
npx @loomidev/mcp-server
```

Or install it and point your MCP client at the binary directly:

```bash
npm install -g @loomidev/mcp-server
```

## Configure an MCP client

Add this server to your client's MCP settings (path varies by client — for example
`.claude/settings.json`, `~/.cursor/mcp.json`, or a desktop client's MCP config):

```json
{
  "mcpServers": {
    "loomiui": {
      "command": "npx",
      "args": ["-y", "@loomidev/mcp-server"]
    }
  }
}
```

## What it exposes

| Tool                 | Description                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `list_components`    | List every component (optionally filtered by `category`: `standalone` \| `forms` \| `content` \| `navigation`). |
| `search_components`  | Find components by keyword (matches name, description, category).                                               |
| `get_component_docs` | Get the full docs (usage, attribute table, events) for one component by name or tag.                            |

Plus one MCP **resource** per component at `loomi://docs/<name>` (e.g.
`loomi://docs/button`) for direct reads.

## Rebuilding the bundled docs

`pnpm build` runs `scripts/build-manifest.mjs`, which reads every sibling
`packages/*/README.md` in this LoomiUI source checkout and bundles them into
`src/generated/manifest.json` before compiling. Re-run it whenever a component's README
changes.

## Dependencies

- No LoomiUI package dependencies.
