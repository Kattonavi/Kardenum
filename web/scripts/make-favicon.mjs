// Builds src/app/favicon.ico from src/app/icon.svg, which is the brand package's
// kardenum-favicon.svg (docs/handoff/marca) unchanged. Browsers use the SVG; crawlers and old
// clients ask for /favicon.ico by habit and were getting a 404.
//   node scripts/make-favicon.mjs
// Run it again only if the brand's icon changes. It draws the SVG with the Chromium that the
// browser tests already use, so the project needs no image library.
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const SIZES = [16, 32, 48];
const source = new URL("../src/app/icon.svg", import.meta.url);
const target = new URL("../src/app/favicon.ico", import.meta.url);

const svg = await readFile(source);
const browser = await chromium.launch();
const images = [];
try {
  for (const size of SIZES) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(
      `<body style="margin:0;background:transparent"><img width="${size}" height="${size}" style="display:block" src="data:image/svg+xml;base64,${svg.toString("base64")}"></body>`,
    );
    await page.locator("img").evaluate((img) => img.decode());
    images.push({ size, png: await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } }) });
    await page.close();
  }
} finally {
  await browser.close();
}

// ICO container holding PNG images: a 6-byte header, one 16-byte entry per image, then the images.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(images.length, 4);

let offset = header.length + 16 * images.length;
const entries = images.map(({ size, png }) => {
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width
  entry.writeUInt8(size, 1); // height
  entry.writeUInt8(0, 2); // palette colors: none
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(offset, 12);
  offset += png.length;
  return entry;
});

await writeFile(target, Buffer.concat([header, ...entries, ...images.map((image) => image.png)]));
console.log(`favicon.ico: ${images.map((image) => `${image.size}px ${image.png.length} B`).join(", ")} -> ${offset} bytes`);
