import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactPlugin from "eslint-plugin-react";
import prettier from 'eslint-config-prettier';
import { globalIgnores } from "eslint/config";
import { fixupPluginRules } from "@eslint/compat";

export default [
  js.configs.recommended,
  {
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed for Vite/React 17+
    },
    plugins: {
        react: fixupPluginRules(reactPlugin),
    },
    settings: {
        react: {
            version: "detect"
        }
    },
  },
  prettier, // Must be last to override other configs
  globalIgnores([
		"build/", "dist/"
	]),
];
