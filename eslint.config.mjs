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
      "_archive/**",
      "modern-app/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/**",
      "assets/**",
      "wp-content/**",
      "wp-includes/**",
      "homepage/**",
      "logo/**",
      "logo-g/**",
      "reports/**",
      "cdn-cgi/**",
      "tests/**",
      "test-results/**",
      "compress-images.js",
      "hy/**",
      "ru/**",
      "about-us/**",
      "our-partners/**",
      "distribution/**",
      "vacancy/**",
      "contact-us/**",
      "privacy-policy/**",
    ],
  },
];

export default eslintConfig;
