import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      prettier: prettierPlugin, // add prettier plugin
    },
    extends: [
      js.configs.recommended, // recommended JS rules
      prettierConfig, // turn off ESLint rules that conflict with Prettier
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      semi: ["error", "always"],
      "prettier/prettier": "off",
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
      "max-len": ["warn", { code: 80 }],
      "no-unused-vars": "off",
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
]);

