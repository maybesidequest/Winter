import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const descriptorPath = resolve(process.cwd(), "../InterChat/packages/contracts/control-v1.desc");
const outputPath = resolve(process.cwd(), "app/generated/control/v1/controlDescriptor.ts");
const descriptor = await readFile(descriptorPath);
await writeFile(
  outputPath,
  `export const CONTROL_DESCRIPTOR_BASE64 = ${JSON.stringify(descriptor.toString("base64"))};\n`,
);
