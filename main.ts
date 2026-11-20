// gta6-clipper-01 entry: hands the house the video under review.
// Node 22, standard library only, no network access.
// Usage: MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? ".";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";

const source = join(botDir, "VIDEO.json");

if (!existsSync(source)) {
  throw new Error(`VIDEO.json not found in ${botDir}`);
}

const parsed = JSON.parse(readFileSync(source, "utf8")) as { url?: unknown };
if (typeof parsed.url !== "string" || !parsed.url.startsWith("http")) {
  throw new Error("VIDEO.json must contain a url string");
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, "VIDEO.json"));
console.log(`Wrote VIDEO.json to ${outputDir} (video: ${parsed.url})`);
