import { puppeteerLauncher } from "@web/test-runner-puppeteer";
import { esbuildPlugin } from "@web/dev-server-esbuild";

// Runs each package's smoke tests (packages/<name>/test/*.test.ts) against the real,
// built `dist/` output in a real headless Chromium — these test the same artifact a
// consumer would actually install, not the TS source. Run `pnpm build` first.
export default {
  rootDir: ".",
  files: "packages/*/test/**/*.test.ts",
  nodeResolve: true,
  // Running test files concurrently has caused flaky timeouts on dev machines under
  // load (each file launches its own real Chromium page; CPU contention slows DOM/JS
  // execution enough to blow even a generous per-test timeout). Every test here has
  // been verified to pass reliably in isolation — concurrency:1 trades wall-clock time
  // for determinism, which is the right tradeoff for a suite this small (a few dozen
  // tests). Revisit if/when this becomes slow enough to matter.
  concurrency: 1,
  browsers: [puppeteerLauncher({ launchOptions: { args: ["--no-sandbox"] } })],
  // Loaded before the test framework so every package's assertions are covered — see the
  // file for why a failed assertion on a DOM node would otherwise hang the whole run.
  testRunnerHtml: (testFramework) => `<!doctype html>
    <html>
      <body>
        <script type="module" src="/test/chai-dom-diff.js"></script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>`,
  plugins: [esbuildPlugin({ ts: true, target: "es2022" })],
  testFramework: {
    config: { ui: "bdd", timeout: "10000" },
  },
};
