// eslint.config.mjs
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
  // 1) Global ignores
  { ignores: [
      "src/mockData/*", 
      ".next/*",
      "**/*.d.ts",
      "*.config.*",
      "next-env.d.ts",
      "**/*.json"
    ] 
  },

  // 2) Base JS config (applies to ALL files unless overridden)
  //    Uses default parser (Espree). Also explicitly disable any inherited TS project mode.
  {
    files: ["**/*.{js,cjs,mjs,json}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        // Important: neutralize any inherited TS "project" setting on JS files
        project: false,
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["debug", "warn", "error"] }],
    },
  },

  // 3) TypeScript files: turn on TS parser + project mode
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
    // If you need the TS rules preset, bring it in here (recommended flat ruleset)
    // You can keep using compat if your presets aren't flat yet:
    // ...compat.config({ extends: ["plugin:@typescript-eslint/recommended"] }),
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { vars: "all", args: "all", ignoreRestSiblings: true, argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true },
      ],
      "no-console": ["warn", { allow: ["debug", "warn", "error"] }],
    },
  },

  // 4) Next.js presets (use FlatCompat if you’re still on legacy presets)
  // Place these AFTER the language scoping above so the parsers stay constrained.
  ...compat.extends(
    "next/core-web-vitals",
    // If this preset forces TS across the board and causes trouble, remove it:
    "next/typescript",
    "plugin:@tanstack/query/recommended",
    "plugin:@typescript-eslint/recommended"
  ),
];
