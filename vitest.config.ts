import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const source = (path: string): string => fileURLToPath(new URL(path, import.meta.url));
const localPluginAliases = readdirSync(source("./packages/plugins"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(source(`./packages/plugins/${entry.name}/src/index.ts`)))
  .map((entry) => ({ find: `@pi-harness/plugin-${entry.name}`, replacement: source(`./packages/plugins/${entry.name}/src/index.ts`) }));

export default defineConfig({
  resolve: { alias: localPluginAliases },
  test: {
    execArgv: ["--expose-internals"],
    pool: "forks",
    maxWorkers: 4,
    server: { deps: { inline: ["@pi-harness/plugin-api"] } },
  },
});
