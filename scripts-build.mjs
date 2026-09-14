import { existsSync, readdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const manifests = new Map();
for (const directory of readdirSync("packages/plugins", { withFileTypes: true })) {
  if (!directory.isDirectory()) continue;
  const manifest = JSON.parse(readFileSync(`packages/plugins/${directory.name}/package.json`, "utf8"));
  manifests.set(manifest.name, { ...manifest, directory: directory.name });
}

const ordered = [];
const visiting = new Set();
const visited = new Set();
const visit = (name) => {
  if (visited.has(name)) return;
  if (visiting.has(name)) throw new Error(`workspace dependency cycle detected at ${name}`);
  visiting.add(name);
  const manifest = manifests.get(name);
  for (const dependency of Object.keys(manifest.dependencies ?? {})) {
    if (manifests.has(dependency)) visit(dependency);
  }
  visiting.delete(name);
  visited.add(name);
  ordered.push(name);
};
for (const name of manifests.keys()) visit(name);

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
for (const name of ordered) {
  const manifest = manifests.get(name);
  if (manifest.scripts?.build === undefined) continue;
  const result = spawnSync(npm, ["run", "build", "--workspace", name], { stdio: "inherit" });
  if (result.error !== undefined) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  for (const entry of [manifest.main, manifest.types]) {
    if (typeof entry !== "string") continue;
    const output = join("packages/plugins", manifest.directory, entry);
    if (!existsSync(output)) throw new Error(`${name} build did not produce ${entry}`);
  }
}
