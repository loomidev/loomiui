// Verifies the other half of server-side rendering: that a browser can take the
// Declarative Shadow DOM markup `check:ssr` produces and *hydrate* it — adopting the
// server-rendered nodes rather than discarding them and re-rendering from scratch.
//
// check:ssr proves valid markup comes out of Node. It cannot prove that markup is usable.
// A component whose client render disagrees with its server render still emits perfect
// HTML; the failure only shows up in a browser, as a flash of replaced content or a
// "Hydration value mismatch" console error. Guarding against that is what this adds — and
// it is a real hazard for this library specifically, because the isServer guards that make
// components server-renderable are exactly the code that can make the two sides disagree.
//
// Every server-rendered node is marked before the component definitions load, then
// identity is compared afterwards: markers surviving means hydration adopted the DOM.
import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";
import { html, unsafeStatic } from "lit/static-html.js";
import { chromium } from "playwright";
import { build } from "esbuild";
import { createServer } from "node:http";
import { mkdtempSync, writeFileSync, rmSync, readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const packagesDir = path.join(rootDir, "packages");

const tags = [];
for (const name of readdirSync(packagesDir)) {
  const manifestPath = path.join(packagesDir, name, "custom-elements.json");
  if (!existsSync(manifestPath)) continue;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      if (declaration.customElement && declaration.tagName) tags.push(declaration.tagName);
    }
  }
}
tags.sort();

await import(path.join(packagesDir, "components", "dist", "index.js"));

const tmpDir = mkdtempSync(path.join(rootDir, ".hydration-"));

try {
  const sections = tags
    .map((tag) => {
      const tagName = unsafeStatic(tag);
      const markup = collectResultSync(render(html`<${tagName}></${tagName}>`));
      return '<div data-case="' + tag + '">' + markup + "</div>";
    })
    .join("\n");

  writeFileSync(
    path.join(tmpDir, "index.html"),
    "<!doctype html><html><body>\n" +
      sections +
      '\n<script type="module" src="./bundle.js"></script>\n</body></html>',
  );

  // "development" matches the condition @lit-labs/ssr-client resolves under; mixing the
  // two builds reintroduces the duplicate-Lit problem inside the bundle itself.
  await build({
    entryPoints: [path.join(scriptDir, "hydration-entry.js")],
    outfile: path.join(tmpDir, "bundle.js"),
    bundle: true,
    format: "esm",
    conditions: ["development"],
    logLevel: "silent",
  });

  // Chromium refuses ES modules over file:// (opaque origin). A plain static server is
  // enough here: the bundle has no bare specifiers left to resolve.
  const server = createServer((req, res) => {
    const name = req.url === "/" ? "/index.html" : req.url.split("?")[0];
    try {
      const body = readFileSync(path.join(tmpDir, name));
      res.writeHead(200, {
        "content-type": name.endsWith(".js") ? "text/javascript" : "text/html",
      });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(8140, "127.0.0.1", resolve));

  const browser = await chromium.launch();
  const failures = [];
  let adopted = 0;

  try {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(String(error.message).split("\n")[0]));

    await page.goto("http://127.0.0.1:8140/index.html", { waitUntil: "load" });
    await page
      .waitForFunction("window.__ssrDone === true", null, { timeout: 120000 })
      .catch(() => {});

    const results = await page.evaluate(() => window.__ssrResults);
    if (!results) {
      failures.push([
        "(page)",
        "the hydration bundle never finished: " + (pageErrors[0] ?? "no error reported"),
      ]);
    } else {
      for (const tag of tags) {
        const result = results[tag];
        if (!result || result.missing) {
          failures.push([tag, "element was not present in the server markup"]);
        } else if (result.relocated) {
          failures.push([tag, "element could not be found after definitions loaded"]);
        } else if (result.error) {
          failures.push([tag, "hydration threw: " + result.error]);
        } else if (!result.hadShadowRoot) {
          failures.push([tag, "browser did not parse a declarative shadow root"]);
        } else if (result.nodes > 0 && result.adopted === 0) {
          failures.push([
            tag,
            "hydration replaced the server DOM (" + result.nodes + " server nodes, none adopted)",
          ]);
        } else {
          adopted += 1;
        }
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length > 0) {
    console.error(failures.length + " of " + tags.length + " components failed to hydrate:");
    for (const [tag, reason] of failures) console.error("  " + tag + ": " + reason);
    console.error(
      "\nA hydration mismatch means the client rendered a different template shape than the\n" +
        "server did — usually an isServer guard that flips a conditional. Render the same\n" +
        "structure on both sides and hide the difference in CSS instead.",
    );
    process.exit(1);
  }

  console.log("All " + adopted + " components hydrate their server-rendered DOM in place.");
} finally {
  rmSync(tmpDir, { recursive: true, force: true });
}
