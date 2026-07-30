#!/usr/bin/env node
// Copies the built CMS preview stylesheet into site/static/ so Hugo
// publishes it at /cms-preview.css (the fixed URL the preview iframe
// loads from). Also removes the empty JS chunk the CSS-only entry
// produces, which would otherwise leak into the Hugo build.
const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "..", "dist");
const target = path.join(__dirname, "..", "site", "static", "cms-preview.css");

const src = path.join(distDir, "cms-preview.css");
if (!fs.existsSync(src)) {
  console.error("copy-cms-preview: dist/cms-preview.css not found");
  process.exit(1);
}
fs.copyFileSync(src, target);
console.log("copy-cms-preview: wrote " + path.relative(process.cwd(), target));

for (const f of fs.readdirSync(distDir)) {
  if (/^cms-preview\..*\.js$/.test(f) || f === "cms-preview.js") {
    fs.unlinkSync(path.join(distDir, f));
  }
}
