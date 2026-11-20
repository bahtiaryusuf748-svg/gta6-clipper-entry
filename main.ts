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
const videoId = parseYouTubeVideoId(parsed.url);
if (videoId === null) {
  throw new Error(
    `VIDEO.json url is not a YouTube video address (expected youtube.com/shorts/<id>, youtube.com/watch?v=<id> or youtu.be/<id>, id 11 of [A-Za-z0-9_-]): ${JSON.stringify(parsed.url)}`,
  );
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, join(outputDir, "VIDEO.json"));
console.log(`Wrote VIDEO.json to ${outputDir} (video: ${parsed.url})`);

// Returns the 11-character video id when the value is a YouTube video
// address, null otherwise. Accepts www. or m. hosts, and ignores any
// query or fragment after the id.
function parseYouTubeVideoId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^(www|m)\./, "");
  const segments = url.pathname.split("/").filter(Boolean);
  let id: string | null = null;
  if (host === "youtube.com" && segments[0] === "shorts") {
    id = segments[1] ?? null;
  } else if (host === "youtube.com" && segments[0] === "watch") {
    id = url.searchParams.get("v");
  } else if (host === "youtu.be") {
    id = segments[0] ?? null;
  }
  return id !== null && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}
