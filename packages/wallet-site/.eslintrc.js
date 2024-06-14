module.exports = {
  env: {
    node: true,
  },
  extends: ["next/core-web-vitals"],
  plugins: ["import", "react", "@typescript-eslint"],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["@metamask/eslint-config-browser"],
      rules: {
        "jsdoc/match-description": "off",
        "import/unambiguous": "off",
      },
    },
  ],
  ignorePatterns: [".cache/", "public/"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "sort-imports": [
      "error",
      { ignoreDeclarationSort: true, ignoreCase: true },
    ],
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "unknown",
        ],
        pathGroups: [{ pattern: "@/**", group: "internal" }],
        pathGroupsExcludedImportTypes: [],
      },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@next/next/no-html-link-for-pages": "off",
  },
};
