#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsRoot = path.join(skillRoot, "assets");
const manifestPath = path.join(assetsRoot, "SHA256SUMS");

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return collect(absolute);
    if (entry.isFile() && absolute !== manifestPath) return [absolute];
    return [];
  }));
  return files.flat();
}

const files = (await collect(assetsRoot)).sort((left, right) => left.localeCompare(right));
const lines = await Promise.all(files.map(async (file) => {
  const hash = createHash("sha256").update(await readFile(file)).digest("hex");
  return `${hash}  ${path.relative(skillRoot, file)}`;
}));

await writeFile(manifestPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Updated ${path.relative(skillRoot, manifestPath)} for ${files.length} assets.`);
