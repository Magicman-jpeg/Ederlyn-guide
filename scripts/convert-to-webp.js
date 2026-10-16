#!/usr/bin/env node
/**
 * convert-to-webp.js
 * ------------------------------------------------------------------
 * Converts an input image (JPG/PNG/HEIC/etc.) into optimized WebP
 * assets for the portfolio. Produces two widths for a responsive
 * <picture>: 640w (1x card) and 1280w (2x / retina).
 *
 * Usage:
 *   node scripts/convert-to-webp.js <input-image> [outName]
 *
 * Example:
 *   node scripts/convert-to-webp.js raw/ederlyn.jpg ederlyn
 *   -> assets/ederlyn-640.webp
 *   -> assets/ederlyn-1280.webp
 *
 * Requires: sharp (installed as a dev dependency).
 * ------------------------------------------------------------------
 */
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

async function main() {
  const input = process.argv[2];
  const outName = process.argv[3] || "ederlyn";

  if (!input) {
    console.error("Usage: node scripts/convert-to-webp.js <input-image> [outName]");
    process.exit(1);
  }
  if (!fs.existsSync(input)) {
    console.error("Input file not found:", input);
    process.exit(1);
  }

  const outDir = path.join(__dirname, "..", "assets");
  fs.mkdirSync(outDir, { recursive: true });

  const sizes = [640, 1280];
  for (const width of sizes) {
    const outPath = path.join(outDir, `${outName}-${width}.webp`);
    await sharp(input)
      .rotate() // respect EXIF orientation
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(outPath);
    const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
    console.log(`✓ ${outPath}  (${kb} KB)`);
  }
  console.log("Done. Reference assets/" + outName + "-640.webp in index.html.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
