// Ensures dist/index.js has a shebang (tsc doesn't reliably preserve it) and is
// executable, so `npx @loomidev/mcp-server` / direct invocation works.
import { readFileSync, writeFileSync, chmodSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const entry = resolve(__dirname, "../dist/index.js");
const shebang = "#!/usr/bin/env node\n";

const content = readFileSync(entry, "utf8");
if (!content.startsWith("#!")) {
  writeFileSync(entry, shebang + content);
}
chmodSync(entry, 0o755);
console.log("[@loomidev/mcp-server] dist/index.js is executable.");
