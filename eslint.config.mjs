import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: ["dist/**", ".astro/**", ".next/**", "node_modules/**", "out/**", "public/pdf.worker.min.mjs"],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
