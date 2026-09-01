#!/usr/bin/env node

/**
 * Fail-closed, dependency-free checks for the Winter Phase 3 boundary.
 *
 * These checks are intentionally structural. They do not replace type,
 * integration, or browser tests; they prevent a forbidden ownership path from
 * being reintroduced while those suites run in CI.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const appRoot = join(root, "app");
const generatedRoot = join(appRoot, "generated");

if (!existsSync(appRoot)) {
  throw new Error(`Expected Winter app directory at ${appRoot}`);
}

function filesUnder(directory, predicate = () => true) {
  const result = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...filesUnder(path, predicate));
    else if (predicate(path)) result.push(path);
  }
  return result;
}

const sourceFiles = filesUnder(appRoot, (path) =>
  /\.(?:ts|tsx|mjs|js)$/.test(path) && !path.startsWith(`${generatedRoot}/`),
);

const forbidden = [
  [/from\s+["']@grpc\/proto-loader["']|require\(["']@grpc\/proto-loader["']\)/, "runtime proto-loader import"],
  [/\bprotoLoader\b|CONTROL_DESCRIPTOR_BASE64|deepTo(?:Snake|Camel)Case/, "dynamic descriptor or case-conversion transport"],
  [/\b(?:IrisClient|PolarizerClient)\b|from\s+["'][^"']*(?:iris|polarizer)[^"']*["']/i, "direct Iris/Polarizer client import"],
  [/\b(?:IRIS|POLARIZER)_[A-Z0-9_]+\b|DISCORD_BOT_TOKEN|MANAGEMENT_DATABASE_URL|INTERCHAT_MANAGEMENT_DATABASE_URL/, "forbidden provider or shared-management credential"],
  [/dangerouslySetInnerHTML\s*=|dangerouslySetInnerHTML\s*:/, "global or unsanitized HTML injection"],
];

const violations = [];
for (const path of sourceFiles) {
  const text = readFileSync(path, "utf8");
  for (const [pattern, label] of forbidden) {
    if (pattern.test(text)) violations.push(`${relative(root, path)}: ${label}`);
  }
}

const staticIndex = join(appRoot, "generated/control/v1/static/index.ts");
if (!existsSync(staticIndex)) violations.push("app/generated/control/v1/static/index.ts: generated static client index is missing");

const migrationDirectory = join(root, "migrations");
const migrationFiles = existsSync(migrationDirectory)
  ? filesUnder(migrationDirectory, (path) => /\.(?:sql|js|mjs|ts)$/.test(path))
  : [];
if (migrationFiles.length === 0) violations.push("migrations: no checked-in Winter-owned migration exists");

const runtimeCreateTable = filesUnder(appRoot, (path) => /\.(?:ts|tsx|mjs|js)$/.test(path))
  .filter((path) => !path.startsWith(`${generatedRoot}/`))
  .some((path) => /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS/i.test(readFileSync(path, "utf8")));
if (runtimeCreateTable) violations.push("app: runtime CREATE TABLE IF NOT EXISTS is forbidden; use node-pg-migrate");

if (violations.length > 0) {
  console.error("Phase 3 structural validation failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log(`Phase 3 structural validation passed (${sourceFiles.length} source files, ${migrationFiles.length} migration files).`);
