import eslint from "@eslint/js";
import typescript from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";

export default [
  eslint.configs.recommended,
  ...typescript.configs.recommended,
  ...typescript.configs.stylistic,
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-native": reactNativePlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React rules
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // React Native rules
      "react-native/no-unused-styles": "error",
      "react-native/no-inline-styles": "warn",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescript.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // Function-specific rules
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "max-params": ["warn", 4],
      "@typescript-eslint/func-style": ["error", "expression"],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/explicit-module-boundary-types": "error",

      // Additional function-related rules
      complexity: ["warn", 10],
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/require-await": "error",
    },
  },
];
