#!/usr/bin/env node
/**
 * make-placeholder.js
 * Generates a tasteful editorial portrait placeholder (monogram on a
 * warm, duotone backdrop) and exports it as WebP at 640w and 1280w so
 * the responsive <picture> works before the real headshot is added.
 * Replace with the real photo via: node scripts/convert-to-webp.js <img> ederlyn
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

function svg(size) {
  const s = size;
  const r = Math.round(s * 0.5);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${s}" height="${Math.round(s * 1.2)}" viewBox="0 0 ${s} ${Math.round(
    s * 1.2
  )}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2a2622"/>
      <stop offset="1" stop-color="#15120f"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.38" r="0.6">
      <stop offset="0" stop-color="#c9743e" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#c9743e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <circle cx="${r}" cy="${Math.round(s * 0.46)}" r="${Math.round(
    s * 0.26
  )}" fill="none" stroke="#e0a37a" stroke-opacity="0.5" stroke-width="2"/>
  <text x="50%" y="${Math.round(s * 0.46)}" dy="0.36em" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif" font-size="${Math.round(
      s * 0.3
    )}" font-weight="600" fill="#f2e7dd" letter-spacing="2">EC</text>
  <text x="50%" y="${Math.round(s * 0.92)}" text-anchor="middle"
    font-family="-apple-system, 'Segoe UI', Roboto, sans-serif" font-size="${Math.round(
      s * 0.045
    )}" letter-spacing="6" fill="#c9a893">EDERLYN&#160;H.&#160;CAPARAS</text>
</svg>`;
}

async function main() {
  const outDir = path.join(__dirname, "..", "assets");
  fs.mkdirSync(outDir, { recursive: true });
  for (const width of [640, 1280]) {
    const buf = Buffer.from(svg(width));
    const outPath = path.join(outDir, `ederlyn-${width}.webp`);
    await sharp(buf).webp({ quality: 85, effort: 6 }).toFile(outPath);
    const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`✓ placeholder ${outPath} (${kb} KB)`);
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
