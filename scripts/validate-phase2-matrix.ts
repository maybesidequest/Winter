import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const matrixPath = resolve(root, "docs/dashboard/phase-2-capability-matrix.md");
const matrix = readFileSync(matrixPath, "utf8");
const allowedStates = new Set([
  "missing",
  "control-only",
  "dual-path",
  "bot-on",
  "winter-on",
  "soaking",
  "complete",
  "excluded",
]);

const errors: string[] = [];
const rows = matrix
  .split("\n")
  .filter((line) => line.startsWith("| `") && !line.includes("Capability ID"));

if (rows.length === 0) errors.push("Phase 2 capability matrix has no capability rows.");

for (const row of rows) {
  const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
  const id = cells[0] || "unknown";
  const state = (cells[13] || "").replaceAll("`", "");
  const evidence = cells[14] || "";

  if (!allowedStates.has(state)) {
    errors.push(`${id}: unsupported cutover state '${state}'.`);
  }
  if ((state === "complete" || state === "soaking") && /pending|historical|ci passed/i.test(evidence)) {
    errors.push(`${id}: ${state} cannot use unverified evidence '${evidence}'.`);
  }
}

if (/CI passed/i.test(matrix)) {
  errors.push("Phase 2 matrix contains the invalid historical evidence label 'CI passed'.");
}

const flagFiles = new Bun.Glob("app/**/*.{ts,tsx}").scanSync({ cwd: root, absolute: true });
const referencedFlags = new Set<string>();
for (const file of flagFiles) {
  const source = readFileSync(file, "utf8");
  for (const match of source.matchAll(/CONTROL_CAP_[A-Z0-9_]+/g)) referencedFlags.add(match[0]);
}
for (const flag of referencedFlags) {
  if (!matrix.includes(`\`${flag}\``)) errors.push(`${flag}: no capability-matrix row references this flag.`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `Phase 2 matrix error: ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Phase 2 matrix valid: ${rows.length} rows, ${referencedFlags.size} flags.`);
