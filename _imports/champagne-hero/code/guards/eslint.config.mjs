import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "app/preview/**",
      "legacy/**",
    ],
  },
  ...compat.config({
    overrides: [
      {
        files: ["brand-guard.cjs", "postcss.config.js"],
        env: { node: true },
        rules: {
          "@typescript-eslint/no-var-requires": "off",
          "@typescript-eslint/no-require-imports": "off",
          "import/no-commonjs": "off",
        },
      },
      {
        files: ["scripts/**/*.cjs"],
        env: { node: true },
        rules: {
          "@typescript-eslint/no-var-requires": "off",
          "@typescript-eslint/no-require-imports": "off",
          "import/no-commonjs": "off",
        },
      },
    ],
  }),
];

export default eslintConfig;
