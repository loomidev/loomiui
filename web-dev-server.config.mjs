// Config for the `loomi-forms-preview` launch target (see .claude/launch.json).
//
// Plain `wds --node-resolve` only rewrites bare-specifier paths — it never transforms
// CommonJS. `quill`'s own entry is real ESM, but its dependency `quill-delta` ships
// CJS-only (`dist/Delta.js` ends with `module.exports = Delta`), which has zero
// `export` statements. Served directly as a native ES module, the browser correctly
// reports it as having no exports, so `import Delta from "quill-delta"` inside quill
// fails with "does not provide an export named 'default'" and `<loomi-text-editor>`
// never finishes constructing Quill — the editor area renders empty.
//
// `@web/dev-server-rollup`'s `fromRollup()` adapter only does per-file transforms, so
// pairing it with `@rollup/plugin-commonjs` doesn't work here: the plugin rewrites
// `quill-delta`'s file in isolation but can't also rewrite `quill`'s `import Delta
// from "quill-delta"` call site to match (that cross-file rewrite only happens during
// a real Rollup bundle, not live per-request serving). So instead: pre-bundle just
// `quill` with esbuild into one self-contained ESM blob in memory at server startup
// (esbuild's bundler does the CJS interop correctly), and serve that in place of the
// bare "quill" specifier. Every other package here is real ESM already and is left to
// the normal built-in `nodeResolve`.
import { buildSync } from "esbuild";
import { fileURLToPath } from "node:url";

const QUILL_VIRTUAL_PATH = "/__loomi_quill_bundle__.js";

// `quill` is only symlinked into `packages/text-editor/node_modules` (it's that
// package's dependency, not hoisted to the workspace root), so esbuild needs to
// resolve "quill" from there rather than from this file's own directory.
const quillBundle = buildSync({
  entryPoints: ["quill"],
  bundle: true,
  format: "esm",
  platform: "browser",
  write: false,
  absWorkingDir: fileURLToPath(new URL("./packages/text-editor", import.meta.url)),
}).outputFiles[0].text;

function quillBundlePlugin() {
  return {
    name: "loomi-quill-bundle",
    resolveImport({ source }) {
      if (source === "quill") return QUILL_VIRTUAL_PATH;
    },
    serve(context) {
      if (context.path === QUILL_VIRTUAL_PATH) {
        return { body: quillBundle, type: "js" };
      }
    },
  };
}

export default {
  nodeResolve: true,
  plugins: [quillBundlePlugin()],
};
