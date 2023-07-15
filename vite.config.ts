/// <reference types="vitest" />
import typescript from "@rollup/plugin-typescript";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import packageJson from "./package.json";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: packageJson.name,
      fileName: "index",
    },
  },
  plugins: [
    typescript({
      exclude: ["**/*.test.ts"],
    }),
  ],
  test: {
    includeSource: ["src/**/*.{js,ts}"],
    testTimeout: 30000,
    globals: true,
    setupFiles: "dotenv/config",
    reporters: ["verbose", "hanging-process"],
  },
});
