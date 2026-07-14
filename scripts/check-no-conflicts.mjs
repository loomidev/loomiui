// Fails if any tracked file contains an unresolved git merge-conflict marker. ESLint catches
// these in .ts sources (they make a file unparseable), but generated JSON manifests and
// other non-linted files can silently carry markers into a commit — as happened once with
// packages/otp/custom-elements.json. Run from the repo root: `node scripts/check-no-conflicts.mjs`.
import { execFileSync } from "node:child_process";

// Anchored markers only, so ======= inside a legit file (e.g. a Markdown rule) doesn't trip it.
const pattern = "^(<<<<<<<|>>>>>>>|=======$)";

let hits = "";
try {
  // git grep exits 1 when there are no matches — that's the success case here.
  hits = execFileSync("git", ["grep", "-nE", pattern, "--", ".", ":(exclude)pnpm-lock.yaml"], {
    encoding: "utf8",
  });
} catch (err) {
  if (err.status === 1) {
    console.log("[check-no-conflicts] OK — no merge-conflict markers found.");
    process.exit(0);
  }
  throw err;
}

console.error("Merge-conflict markers found in tracked files:\n" + hits);
process.exit(1);
