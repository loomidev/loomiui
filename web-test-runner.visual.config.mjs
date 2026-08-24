import { playwrightLauncher } from "@web/test-runner-playwright";
import { esbuildPlugin } from "@web/dev-server-esbuild";
import { visualRegressionPlugin } from "@web/test-runner-visual-regression/plugin";

// Visual regression runs as its own suite, separate from `pnpm test`, for two reasons:
// it is far slower than the unit tests, and its baselines are bitmaps that only match the
// platform that produced them. Font rasterisation differs between macOS and Linux, so a
// baseline recorded on a laptop will not match one recorded on a CI runner.
//
// Baselines are therefore stored per platform under
// screenshots/<platform>/baseline/<browser>/, and a platform's set has to be recorded once
// on that platform:
//
//   pnpm test:visual --update-visual-baseline
//
// Chromium only: a second engine would double the baselines without doubling the
// information, since what this suite guards is the library's own CSS — the palette, the
// spacing scale, the component chrome — not engine rendering differences.
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
  files: "visual/**/*.test.ts",
  nodeResolve: true,
  concurrency: 1,
  browserStartTimeout: 120000,
  browsers: [launcher("chromium")],
  plugins: [
    esbuildPlugin({ ts: true, target: "es2022" }),
    visualRegressionPlugin({
      baseDir: `screenshots/${process.platform}`,
      // Anti-aliasing differs by a pixel or two between runs of the same browser on the
      // same machine. This tolerance absorbs that without hiding a real layout or colour
      // change, which moves far more than 0.5% of the image.
      diffOptions: { threshold: 0.1 },
      failureThreshold: 0.005,
      failureThresholdType: "percent",
      update: process.argv.includes("--update-visual-baseline"),
    }),
  ],
  testFramework: { config: { ui: "bdd", timeout: "20000" } },
};
