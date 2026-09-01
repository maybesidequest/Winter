import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const winterRoot = resolve(dirname(new URL(import.meta.url).pathname), "..");
const protoRoot = resolve(
  winterRoot,
  process.env.CONTROL_PROTO_ROOT || "../interchat-protobuf",
);
const outputRoot = resolve(winterRoot, "app/generated/control/v1/static");
const protoc = process.env.PROTOC || "protoc";
const plugin = resolve(winterRoot, "node_modules/.bin/protoc-gen-ts_proto");

const protoFiles = [
  "control/v1/models.proto",
  "control/v1/hub_service.proto",
  "control/v1/server_service.proto",
  "control/v1/connection_service.proto",
  "control/v1/user_service.proto",
  "control/v1/moderation_service.proto",
  "control/v1/operation_service.proto",
  "control/v1/selector_service.proto",
  "control/v1/preview_service.proto",
];

if (!existsSync(protoRoot)) {
  throw new Error(`Control protobuf checkout does not exist: ${protoRoot}`);
}
if (!existsSync(plugin)) {
  throw new Error(
    `ts-proto is not installed at ${plugin}. Run the pinned package install before generating contracts.`,
  );
}

// Keep generated code in its own subtree. The caller may clean this subtree
// before generation in a normal checkout; avoiding an unconditional recursive
// delete also lets generation run from read-only worktrees and prevents a
// failed protoc invocation from erasing a known-good generated surface.
mkdirSync(outputRoot, { recursive: true });

const args = [
  `-I${protoRoot}`,
  "-I/usr/include",
  `--plugin=protoc-gen-ts_proto=${plugin}`,
  `--ts_proto_out=${outputRoot}`,
  "--ts_proto_opt=esModuleInterop=true,forceLong=number,stringEnums=true,outputServices=nice-grpc,outputServices=generic-definitions,lowerCaseServiceMethods=false,useOptionals=messages,outputJsonMethods=false,useDate=raw",
  ...protoFiles.map((file) => resolve(protoRoot, file)),
];

const result = spawnSync(protoc, args, { cwd: winterRoot, stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) {
  throw new Error(`protoc exited with status ${result.status ?? "unknown"}.`);
}

// This barrel is intentionally produced by the same command as the generated
// files. It gives the transport a stable import surface while ts-proto remains
// free to split messages and service definitions by source .proto file.
const generatedRoot = "./control/v1";
const imports = [
  "models",
  "hub_service",
  "server_service",
  "connection_service",
  "user_service",
  "moderation_service",
  "operation_service",
  "selector_service",
  "preview_service",
];
const serviceExports = imports.slice(1).map((name) => {
  const service = name.replace(/_service$/, "").replace(/(^|_)([a-z])/g, (_, _prefix, letter) => letter.toUpperCase());
  return `export { ${service}ServiceDefinition } from "${generatedRoot}/${name}.js";`;
});
const googleExports = [
  `export { FieldMask } from "${generatedRoot.replace("control/v1", "google/protobuf")}/field_mask.js";`,
  `export { Struct, Value, NullValue } from "${generatedRoot.replace("control/v1", "google/protobuf")}/struct.js";`,
  `export { Timestamp } from "${generatedRoot.replace("control/v1", "google/protobuf")}/timestamp.js";`,
];
const helperNames = new Set(["DeepPartial", "Exact", "MessageFns", "protobufPackage"]);
const typeExports = imports.map((name) => {
  const source = readFileSync(resolve(outputRoot, "control/v1", `${name}.ts`), "utf8");
  const interfaces = [...source.matchAll(/^export interface (\w+)/gm)]
    .map((match) => match[1])
    .filter((item) => !helperNames.has(item));
  const enums = [...source.matchAll(/^export enum (\w+)/gm)]
    .map((match) => match[1])
    .filter((item) => !helperNames.has(item));
  const lines = [];
  if (interfaces.length) lines.push(`export type { ${interfaces.join(", ")} } from "${generatedRoot}/${name}.js";`);
  if (enums.length) lines.push(`export { ${enums.join(", ")} } from "${generatedRoot}/${name}.js";`);
  return lines.join("\n");
}).filter(Boolean);
writeFileSync(resolve(outputRoot, "index.ts"), `${typeExports.join("\n")}\n${serviceExports.join("\n")}\n${googleExports.join("\n")}\n`);

console.log(`Generated static Control Plane TypeScript contracts in ${outputRoot}`);
