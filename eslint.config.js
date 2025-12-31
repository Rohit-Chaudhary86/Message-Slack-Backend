// import js from "@eslint/js";
// import { defineConfig } from "eslint/config";
// import simpleImportSort from "eslint-plugin-simple-import-sort";
// import globals from "globals";

// export default defineConfig([
//   {
//     files: ["**/*.{js,mjs,cjs}"],
//     plugins: {
//       js,
//       "simple-import-sort": simpleImportSort,
//     },
//     extends: ["js/recommended"],
//     languageOptions: { globals: globals.node },
//     rules: {
//       "simple-import-sort/imports": "error",
//       "simple-import-sort/exports": "error",
//     },
//   },
// ]);

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
      "simple-import-sort": simpleImportSort,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      //  IMPORTANT FIXES
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^next$|^_",
          caughtErrorsIgnorePattern: "^err$",
        },
      ],
    },
  },
]);
