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

  // ⬇️ Custom rules override section
  {
    rules: {
      // ✅ Allow `any` type
      "@typescript-eslint/no-explicit-any": "off",

      // ✅ Allow unused variables
      "@typescript-eslint/no-unused-vars": "off",

      // ✅ Optional chaining or null checks still recommended, but no ESLint error
      "@typescript-eslint/no-non-null-assertion": "off",  // allows the use of !
      "react/no-unescaped-entities": "off"
    },
  },
];

export default eslintConfig;
