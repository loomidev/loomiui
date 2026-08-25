import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";

// Runs each package's smoke tests (packages/<name>/test/*.test.ts) against the real,
// built `dist/` output in real headless browsers — these test the same artifact a
// consumer would actually install, not the TS source. Run `pnpm build` first.
//
// Chromium, Firefox and WebKit all run by default, and CI runs all three. This library is
// built on web-platform primitives whose engine support genuinely differs (ElementInternals
// form association, adoptedStyleSheets, focus delegation), so a single-engine result is not
// evidence the components work.
//
// Narrow the matrix with LOOMI_BROWSERS when iterating locally, or when an engine will not
// launch on your machine at all — Playwright's Firefox build does not start on macOS 27
// prereleases, which is a browser/OS problem rather than a library one:
//   LOOMI_BROWSERS=chromium,webkit pnpm test
/**
 * WebKit on macOS regularly needs more than Playwright's default 30s to navigate a fresh
 * test page. A page that misses the window is reported as a browser-level error rather
 * than a test failure, so the file silently contributes no tests and the run still says
 * "0 failed" — an infrastructure flake that looks like a pass. Raise both the page
 * navigation timeout and the browser start timeout so a slow engine waits rather than
 * quietly dropping coverage.
 */
const launcher = (product) =>
  playwrightLauncher({
    product,
    createPage: async ({ context }) => {
      const page = await context.newPage();
      page.setDefaultNavigationTimeout(120000);
      return page;
    },
  });

export default {
  rootDir: ".",
  files: "packages/*/test/**/*.test.ts",
  nodeResolve: true,
  // Running test files concurrently has caused flaky timeouts on dev machines under
  // load (each file launches its own real browser page; CPU contention slows DOM/JS
  // execution enough to blow even a generous per-test timeout). Every test here has
  // been verified to pass reliably in isolation — concurrency:1 trades wall-clock time
  // for determinism, which is the right tradeoff for a suite this small (a few dozen
  // tests). Revisit if/when this becomes slow enough to matter.
  concurrency: 1,
  // WebKit on macOS regularly needs more than the default 30s to hand back a fresh test
  // page under load, and a page that misses the window is reported as a browser-level
  // error (0 passed, 0 failed for that file) rather than a test failure — an infrastructure
  // flake that looks alarming but proves nothing about the code. Give every engine room.
  browserStartTimeout: 120000,
  browsers: (process.env.LOOMI_BROWSERS ?? "chromium,firefox,webkit")
    .split(",")
    .map((product) => product.trim())
    .filter(Boolean)
    .map(launcher),
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
