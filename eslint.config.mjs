import { defineConfig, globalIgnores } from "eslint/config";
import next from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import eslintReact from "@eslint-react/eslint-plugin";

const eslintConfig = defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  next.configs["core-web-vitals"],
  ...tseslint.configs.recommended,
  reactHooks.configs.flat["recommended-latest"],
  eslintReact.configs["recommended-typescript"],
]);

export default eslintConfig;
