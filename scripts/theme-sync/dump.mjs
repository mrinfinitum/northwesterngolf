import { chromium } from "playwright";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
const handles = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
for (const h of handles) {
  const out = `live/${h}`;
  if (existsSync(`${out}/page.html`)) continue;
  mkdirSync(out, { recursive: true });
  await p.goto(`https://northwestern.golf/products/${h}`, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(6000);
  const sections = await p.evaluate(() =>
    [...document.querySelectorAll('[id^="shopify-section-"]')].map((s) => ({ id: s.id, h: Math.round(s.getBoundingClientRect().height), html: s.outerHTML })));
  if (sections.length < 5) { console.log("FAIL", h, sections.length, await p.title()); await p.waitForTimeout(20000); continue; }
  writeFileSync(`${out}/page.html`, await p.content());
  sections.forEach((s, i) => writeFileSync(`${out}/${String(i).padStart(2, "0")}-${s.id.replace(/.*__/, "")}.html`, s.html));
  console.log(h, sections.map((s) => s.id.replace(/.*__/, "")).join(" "));
  await p.waitForTimeout(6000);
}
await b.close();
