// .eslintrc.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js recommended rules via FlatCompat
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Project-specific overrides
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Allow "any" but only warn instead of disabling completely
      "@typescript-eslint/no-explicit-any": "warn",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Optional: relax some stylistic rules
      "react/jsx-props-no-spreading": "off",
      "react/react-in-jsx-scope": "off",
      "import/no-anonymous-default-export": "off",
    },
  },
];

export default eslintConfig;
