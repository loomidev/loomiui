import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";

// Flat ESLint config for the whole monorepo. Type-aware linting is intentionally left off
// to keep it fast across ~80 packages; this catches unparseable files (e.g. leftover merge
// conflict markers), unused code, and common mistakes. Generated and built output is
// excluded — those files are produced by tooling, not hand-edited.
export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/src/generated/**",
      "**/*.css.ts",
      "**/custom-elements.json",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.mjs"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      // Allow intentionally-unused args/vars when prefixed with an underscore.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Tests use Mocha BDD globals; chai assertions (`expect(x).to.exist`) are expression
    // statements by design, so the unused-expression rule doesn't apply here.
    files: ["**/test/**/*.ts"],
    languageOptions: {
      globals: { ...globals.mocha },
    },
    rules: {
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  // Turn off any stylistic rules that would conflict with Prettier. Keep last.
  prettier,
);
