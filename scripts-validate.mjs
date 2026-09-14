import { readdirSync, readFileSync } from "node:fs";

const runtimePeerContract = {
  "@deepseek-ai/cordis": "^4.0.1",
  "@earendil-works/pi-ai": "^0.84.4 || ^0.85.1",
  "@earendil-works/pi-coding-agent": "^0.84.4 || ^0.85.1",
};

const names = new Set();
const manifests = new Map();
for (const directory of readdirSync("packages/plugins", { withFileTypes: true })) {
  if (!directory.isDirectory()) continue;
  const manifest = JSON.parse(readFileSync(`packages/plugins/${directory.name}/package.json`, "utf8"));
  if (!/^@pi-harness\/plugin-[a-z0-9-]+$/.test(manifest.name) || names.has(manifest.name) || !manifest.version || !manifest.main || !manifest.types)
    throw new Error(`invalid manifest: ${directory.name}`);
  names.add(manifest.name);
  manifests.set(manifest.name, manifest);
  for (const [dependency, expected] of Object.entries(runtimePeerContract)) {
    const actual = manifest.peerDependencies?.[dependency];
    if (actual !== undefined && actual !== expected) throw new Error(`${manifest.name} peer ${dependency} must be ${expected}, received ${actual}`);
  }
}
const rootManifest = JSON.parse(readFileSync("package.json", "utf8"));
const rootPluginDependencies = Object.keys({ ...rootManifest.dependencies, ...rootManifest.devDependencies }).filter((name) => names.has(name));
if (rootPluginDependencies.length > 0) throw new Error(`workspace root must not depend on its own plugins: ${rootPluginDependencies.join(", ")}`);

const satisfiesCaret = (range, version) => {
  if (!range.startsWith("^")) return range === version;
  const [major, minor, patch] = range.slice(1).split(".").map(Number);
  const [candidateMajor, candidateMinor, candidatePatch] = version.split(".").map(Number);
  if ([major, minor, patch, candidateMajor, candidateMinor, candidatePatch].some((part) => !Number.isSafeInteger(part) || part < 0))
    return false;
  if (candidateMajor !== major || (major === 0 && candidateMinor !== minor)) return false;
  if (major === 0 && minor === 0) return candidatePatch === patch;
  if (candidateMinor !== minor) return candidateMinor > minor;
  return candidatePatch >= patch;
};
for (const manifest of manifests.values()) {
  for (const [dependency, range] of Object.entries(manifest.dependencies ?? {})) {
    const target = manifests.get(dependency);
    if (target !== undefined && !satisfiesCaret(range, target.version))
      throw new Error(`${manifest.name} dependency ${dependency}@${range} does not accept workspace version ${target.version}`);
  }
}
console.log(`validated ${names.size} plugin manifests`);
