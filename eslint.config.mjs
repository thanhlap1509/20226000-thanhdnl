import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/logs/*.{log}"],
    plugins: { prettier: prettierPlugin },
    extends: [prettierConfig],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
      prettier: prettierPlugin, // add prettier plugin
    },
    extends: [
      "js/recommended", // recommended JS rules
      prettierConfig, // turn off ESLint rules that conflict with Prettier
    ],
    languageOptions: { globals: globals.browser, sourceType: "module" },
    rules: {
      semi: ["error", "always"],
      "operator-linebreak": "warn",
      eqeqeq: "error",
      "dot-notation": "error",
      "prettier/prettier": "off",
      "no-var": "error",
      "prefer-const": "error",
      "no-new-object": "warn",
      "default-param-last": "error",
      "no-iterator": "error",
      "no-restricted-syntax": "error",
      "arrow-parens": "warn",
      "max-len": ["warn", { code: 80 }],
    },
  },
  {
    files: ["**/*/middlewares/errorHandler.{js,mjs,cjs}"],
    plugins: {
      prettier: prettierPlugin,
    },
    extends: [js.configs.recommended, prettierConfig],
    languageOptions: { globals: globals.browser },
    rules: {
      semi: ["error", "always"],
      "prettier/prettier": "off",
      "no-var": "error",
      "max-len": ["warn", { code: 80 }],
      "no-unused-vars": "off",
    },
  },
]);

