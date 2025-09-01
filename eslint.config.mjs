import { defineConfig, globalIgnores } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["src/mockData/*"]), {
    extends: compat.extends(
        "next/core-web-vitals",
        "next/typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:@tanstack/query/recommended",
    ),

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
            tsconfigRootDir: "./",
        },
    },

    rules: {
        "no-console": ["warn", {
            allow: ["debug", "warn", "error"],
        }],

        "@typescript-eslint/no-unused-vars": ["error", {
            vars: "all",
            args: "all",
            ignoreRestSiblings: true,
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/no-explicit-any": "off",

        "@typescript-eslint/no-unused-expressions": ["error", {
            allowShortCircuit: true,
            allowTernary: true,
        }],
    },
}]);