const { chromium } = require("playwright");
const path = require("path");
const http = require("http");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
};

(async () => {
  // Serve the site in-process to avoid background-process / sandbox issues.
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p === "/") p = "/index.html";
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file)) {
      res.writeHead(404);
      return res.end("not found");
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(8123, "127.0.0.1", r));

  const outDir = "/projects/sandbox/.kiro/artifacts/screenshots";
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ args: ["--no-sandbox"] });

  async function scrollThrough(page) {
    // Simulate a visitor scrolling so IntersectionObserver reveals fire.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.6;
      const max = document.body.scrollHeight;
      for (let y = 0; y <= max; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 300));
    });
  }

  // Desktop light
  let page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:8123/index.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await scrollThrough(page);
  await page.screenshot({ path: path.join(outDir, "desktop-light.png"), fullPage: true });

  // Desktop dark
  await page.click("#theme-toggle");
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, "desktop-dark.png"), fullPage: true });
  await page.close();

  // Mobile light
  page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto("http://localhost:8123/index.html", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await scrollThrough(page);
  await page.screenshot({ path: path.join(outDir, "mobile-light.png"), fullPage: true });
  await page.close();

  await browser.close();
  server.close();
  console.log("screenshots done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
