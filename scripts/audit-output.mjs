#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const targets = (process.argv.length > 2 ? process.argv.slice(2) : ["."]).map((entry) => path.resolve(entry));
const extensions = new Set([".css", ".html", ".jsx", ".tsx", ".js", ".mjs"]);
const approved = new Set([
  "#00b6c5", "#1fcedd", "#f1e9da", "#e8dcc8", "#faf6ee",
  "#2e27a8", "#8a6a4a", "#6b3a3a", "#25262b", "#151a2e", "#c99a3f",
]);

const warnings = [];
const critical = [];

async function collect(entry) {
  const info = await stat(entry);
  if (info.isFile()) return extensions.has(path.extname(entry).toLowerCase()) ? [entry] : [];
  if (!info.isDirectory()) return [];
  const name = path.basename(entry);
  if (["node_modules", ".git", "dist", ".next", ".wrangler"].includes(name)) return [];
  const children = await readdir(entry);
  const nested = await Promise.all(children.map((child) => collect(path.join(entry, child))));
  return nested.flat();
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function addMatches(file, text, pattern, message, bucket = warnings) {
  for (const match of text.matchAll(pattern)) {
    bucket.push(`${path.relative(process.cwd(), file)}:${lineNumber(text, match.index || 0)} ${message}: ${match[0]}`);
  }
}

const files = (await Promise.all(targets.map(collect))).flat();
for (const file of files) {
  const text = await readFile(file, "utf8");
  addMatches(file, text, /(?:^|[^A-Za-z0-9_-])(?:sk-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g, "possible secret", critical);
  addMatches(file, text, /font-family\s*:[^;]*(?:Inter|Roboto|Arial)[^;]*;/gi, "generic primary font");
  addMatches(file, text, /\b(?:glassmorphism|backdrop-filter)\b/gi, "glass effect requires explicit justification");
  addMatches(file, text, /(?:bounce|elastic)/gi, "forbidden motion language");
  addMatches(file, text, /letter-spacing\s*:\s*-[^;]+;/gi, "negative letter spacing");
  addMatches(file, text, /#(?:000000|000|ffffff|fff)\b/gi, "pure black or white");

  for (const match of text.matchAll(/#[0-9a-f]{6}\b/gi)) {
    const color = match[0].toLowerCase();
    if (!approved.has(color) && !["#000000", "#ffffff"].includes(color)) {
      warnings.push(`${path.relative(process.cwd(), file)}:${lineNumber(text, match.index || 0)} unapproved hex color: ${match[0]}`);
    }
  }
}

console.log(`Scanned ${files.length} design files across ${targets.length} target(s)`);
if (critical.length) {
  console.error("\nCRITICAL");
  critical.forEach((item) => console.error(`- ${item}`));
}
if (warnings.length) {
  console.warn("\nWARNINGS");
  warnings.slice(0, 120).forEach((item) => console.warn(`- ${item}`));
  if (warnings.length > 120) console.warn(`- ... ${warnings.length - 120} more warnings`);
}
if (!critical.length && !warnings.length) console.log("No token, typography, motion, or secret-pattern issues found.");
process.exitCode = critical.length ? 2 : warnings.length ? 1 : 0;
