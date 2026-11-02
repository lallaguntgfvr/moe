import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");
const pages = [
  "index",
  "about",
  "journal",
  "music",
  "shrine",
  "gallery",
  "guestbook",
  "links",
];
const supported = new Set([
  ".html",
  ".css",
  ".js",
  ".json",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".mp3",
  ".ogg",
  ".wav",
]);

assert.ok(
  existsSync(output),
  "Run vite build before checking the static output.",
);
for (const page of pages) {
  const filename = resolve(output, `${page}.html`);
  assert.ok(existsSync(filename), `Missing standalone page: ${page}.html`);
  const html = readFileSync(filename, "utf8");
  assert.ok(html.includes('id="root"'), `${page}.html needs its app root.`);
  assert.ok(
    !/<script[^>]+src=["'][^"']*\.(?:tsx?|jsx)(?:["'?])/i.test(html),
    `${page}.html still references uncompiled source.`,
  );
  assert.ok(
    !/(?:src|href)=["']\/(?:src|assets)\//i.test(html),
    `${page}.html has a root-relative asset link.`,
  );
  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const url = match[1];
    if (url.startsWith("./")) {
      assert.ok(
        existsSync(resolve(output, url)),
        `${page}.html references a missing file: ${url}`,
      );
    }
  }
}

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = resolve(directory, entry.name);
    if (entry.isDirectory()) walk(filename);
    else
      assert.ok(
        supported.has(extname(filename)),
        `Unsupported static file: ${filename}`,
      );
  }
}
walk(output);
console.log(
  `Static hosting check passed: ${pages.length} HTML pages; all local HTML assets exist; no raw TypeScript or root-relative assets.`,
);
