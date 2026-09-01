import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
if (!process.env.WINTER_DATABASE_URL?.trim()) {
  throw new Error("WINTER_DATABASE_URL is required for Winter migrations.");
}

const cli = resolve(root, "node_modules/.bin/node-pg-migrate");
if (!existsSync(cli)) {
  throw new Error("node-pg-migrate is not installed; refusing to run ad-hoc SQL.");
}

const result = spawnSync(
  cli,
  [
    "up",
    "--database-url-var",
    "WINTER_DATABASE_URL",
    "--migrations-dir",
    "migrations",
    "--migrations-table",
    "winter_pgmigrations",
    "--single-transaction",
    "--check-order",
  ],
  { cwd: root, env: process.env, stdio: "inherit" },
);

if (result.error) throw result.error;
if (result.status !== 0) {
  throw new Error(`Winter migrations exited with status ${result.status ?? "unknown"}.`);
}
