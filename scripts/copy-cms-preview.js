#!/usr/bin/env node
// Copies the built CMS preview stylesheet into site/static/ so Hugo
// publishes it at /cms-preview.css (the fixed URL the preview iframe
// loads from). Also inlines the CSS into the preview HTML's <head>
// as a <style> block so the styles work even when the preview iframe
// is built from srcdoc (where /cms-preview.css would resolve to
// about:srcdoc/cms-preview.css and 404).
// Also removes the empty JS chunk the CSS-only entry produces,
// which would otherwise leak into the Hugo build.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist");

// 1) Copy the CSS to site/static for the <link rel="stylesheet"> route
const cssSrc = path.join(distDir, "cms-preview.css");
const cssTarget = path.join(root, "site", "static", "cms-preview.css");
if (!fs.existsSync(cssSrc)) {
  console.error("copy-cms-preview: dist/cms-preview.css not found");
  process.exit(1);
}
fs.copyFileSync(cssSrc, cssTarget);
console.log("copy-cms-preview: wrote " + path.relative(process.cwd(), cssTarget));

// 2) Inline the CSS into the preview HTML
const css = fs.readFileSync(cssSrc, "utf8");
const previewHtmlPath = path.join(root, "site", "static", "admin", "previews", "index.html");
if (fs.existsSync(previewHtmlPath)) {
  let html = fs.readFileSync(previewHtmlPath, "utf8");
  const styleBlock = `<style id="lw-cms-preview-inline">\n${css}\n</style>`;
  if (html.includes("lw-cms-preview-inline")) {
    html = html.replace(/<style id="lw-cms-preview-inline">[\s\S]*?<\/style>/, styleBlock);
  } else if (/<head>/i.test(html)) {
    html = html.replace(/<head>/i, "<head>\n  " + styleBlock + "\n");
  }
  fs.writeFileSync(previewHtmlPath, html);
  console.log("copy-cms-preview: inlined CSS into " + path.relative(process.cwd(), previewHtmlPath));
}

// 3) Clean up the empty JS chunk for the CSS-only entry
for (const f of fs.readdirSync(distDir)) {
  if (/^cms-preview\..*\.js$/.test(f) || f === "cms-preview.js") {
    fs.unlinkSync(path.join(distDir, f));
  }
}
