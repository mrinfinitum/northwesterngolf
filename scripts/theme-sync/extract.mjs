// usage: node extract.mjs  -> writes extracted.json from live/<handle>/page.html
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const handles = JSON.parse(readFileSync("products.json", "utf8")).data.products.nodes.map((p) => p.handle);
const b = await chromium.launch();
const ctx = await b.newContext({ javaScriptEnabled: false });
const page = await ctx.newPage();
await page.route("**/*", (r) => r.abort());
const result = {};
for (const h of handles) {
  const f = `live/${h}/page.html`;
  if (!existsSync(f)) { console.log("missing", h); continue; }
  const html = readFileSync(f, "utf8");
  await page.setContent(html.replace(/<script[\s\S]*?<\/script>/g, ""), { waitUntil: "domcontentloaded" });
  const data = await page.evaluate(() => {
    const clean = (s) => (s || "").replace(/\s+/g, " ").trim();
    const abs = (u) => (u ? u.replace(/^\/\//, "https://") : u);
    const styleOf = (el) => [...el.querySelectorAll("style")].map((s) => s.textContent.replace(/[a-z0-9]{20,}/g, "X").replace(/template--\d+/g, "T").replace(/\s+/g, " ")).join("\n");
    const sections = [...document.querySelectorAll('[id^="shopify-section-"]')];
    const out = { template: document.body.className, sections: [] };
    for (const s of sections) {
      const id = s.id.replace(/.*__/, "");
      if (["header", "cart-drawer", "search-drawer", "footer_custom_b7aYRP"].some((x) => id === x) || /footer|announcement/.test(id)) continue;
      const css = styleOf(s);
      const rec = { id, css };
      if (s.querySelector("product-gallery, .product-info")) {
        rec.type = "main";
        const info = s.querySelector(".product-info");
        rec.blocks = [...info.querySelectorAll(":scope .product-info__block-item")].map((b) => b.dataset.blockType);
        const text = info.querySelector(".product-info__text .prose");
        rec.textHtml = text ? text.innerHTML.trim() : null;
        rec.offers = [...info.querySelectorAll(".offer")].map((o) => ({ text: clean(o.textContent), svg: o.querySelector("svg")?.outerHTML, style: o.getAttribute("style"), cls: o.className }));
        rec.govx = !!info.querySelector(".govx-id-v2-wrapper");
        rec.accordions = [...info.querySelectorAll("details.accordion")].map((d) => ({ title: clean(d.querySelector("summary").textContent), html: d.querySelector(".accordion__content .prose")?.innerHTML.trim() || d.querySelector(".accordion__content").innerHTML.trim() }));
        rec.galleryMode = s.querySelector("media-carousel")?.getAttribute("desktop-mode");
        rec.mediaCount = s.querySelectorAll(".product-gallery__media").length;
        rec.sectionBg = s.querySelector(".section")?.getAttribute("style");
        rec.title = clean(info.querySelector(".product-info__title")?.textContent);
        const rating = info.querySelector(".product-info__price a.rating");
        rec.rating = rating ? { value: clean(rating.querySelector(".text-sm")?.textContent), title: rating.getAttribute("title"), stars: rating.querySelector(".rating__stars")?.innerHTML } : null;
      } else if (s.querySelector('[class*="ai-marquee-section"]')) {
        rec.type = "marquee";
        const m = s.querySelector('[class*="ai-marquee-section"]');
        rec.text = clean(m.querySelector('[class*="ai-marquee-text"]')?.textContent);
        rec.icon = abs(m.querySelector('[class*="ai-marquee-inline-image"] img')?.getAttribute("src"));
        rec.svgIcon = m.querySelector('[class*="ai-marquee-icon"] svg')?.outerHTML || null;
        rec.background = abs(m.querySelector('[class*="ai-marquee-background"] img')?.getAttribute("src"));
        rec.items = m.querySelectorAll('[class*="ai-marquee-item"]').length;
      } else if (s.querySelector('[class*="ai-editorial-grid"]')) {
        rec.type = "editorialGrid";
        rec.alsoInstafeed = !!s.querySelector("#insta-feed");
        rec.columns = [...s.querySelectorAll('[class*="ai-editorial-grid__column-"]:not([class*="-image"]):not([class*="-heading"]):not([class*="-body"])')].filter((c) => c.querySelector("h3")).map((c) => ({
          image: abs(c.querySelector("img")?.getAttribute("src")),
          heading: clean(c.querySelector("h3")?.textContent),
          body: c.querySelector('[class*="ai-editorial-grid__body"]')?.innerHTML.trim(),
        }));
      } else if (s.querySelector("#insta-feed")) {
        rec.type = "instafeed";
        rec.count = s.querySelectorAll(".instafeed-new-layout-item").length;
        rec.users = [...s.querySelectorAll(".tagged-username-overlay")].map((u) => u.textContent);
      } else if (s.querySelector("images-with-text-scrolling")) {
        rec.type = "imagesScrolling";
        rec.items = [...s.querySelectorAll(".images-scrolling-mobile__item")].map((i) => ({ image: abs(i.querySelector("img")?.getAttribute("src")), counter: clean(i.querySelector(".images-scrolling__counter")?.textContent), html: i.querySelector(".prose")?.innerHTML.trim() }));
      } else if (s.querySelector('[class*="ai-split-layout"]')) {
        rec.type = "split";
        const c = s.querySelector('[class*="ai-split-layout__container"]');
        const first = c.firstElementChild.className;
        rec.mediaFirst = /media/.test(first);
        const v = s.querySelector("video");
        rec.video = v ? { poster: abs(v.getAttribute("poster")), sources: [...v.querySelectorAll("source")].map((x) => ({ src: abs(x.getAttribute("src")), type: x.getAttribute("type") })) } : null;
        const img = [...s.querySelectorAll("img")].map((i) => abs(i.getAttribute("src")));
        rec.images = img;
        rec.heading = clean(s.querySelector('[class*="ai-split-layout__heading"]')?.textContent);
        rec.bodyHtml = (s.querySelector('[class*="ai-split-layout__text-"]:not([class*="container"]):not([class*="content"])') || s.querySelector('[class*="ai-split-layout__body"]'))?.innerHTML.trim();
        rec.variant = c.parentElement.tagName.toLowerCase().startsWith("ai-") ? "B" : "A";
      } else if (s.querySelector(".rich-text")) {
        rec.type = "richText";
        rec.bg = s.querySelector(".section")?.getAttribute("style");
        rec.html = s.querySelector(".prose")?.innerHTML.trim();
      } else if (s.querySelector('[class*="ai-video-layout"]')) {
        rec.type = "video";
        rec.bg = s.querySelector(".section")?.getAttribute("style");
        const v = s.querySelector("video");
        rec.video = { poster: abs(v?.getAttribute("poster")), sources: [...(v?.querySelectorAll("source") || [])].map((x) => ({ src: abs(x.getAttribute("src")), type: x.getAttribute("type") })) };
        rec.text = clean(s.querySelector('[class*="ai-video-layout__text-container"]')?.textContent);
      } else if (s.querySelector('[class*="ai-faq-section"]')) {
        rec.type = "faq";
        rec.heading = clean(s.querySelector('[class*="ai-faq-heading"]')?.textContent);
        rec.subheading = clean(s.querySelector('[class*="ai-faq-subheading"]')?.textContent);
        rec.items = [...s.querySelectorAll("[data-faq-item]")].map((i) => ({ q: clean(i.querySelector('[class*="ai-faq-question-text"]').textContent), a: i.querySelector('[class*="ai-faq-answer-content"]').innerHTML.trim(), open: i.classList.contains("active") }));
      } else if (/related-products/.test(id)) {
        rec.type = "related";
        rec.heading = clean(s.querySelector("h2")?.textContent);
        rec.handles = [...s.querySelectorAll("product-card")].map((p) => p.getAttribute("handle"));
      } else if (s.querySelector("[data-oke-widget]")) {
        rec.type = "reviews";
        rec.productId = s.querySelector("[data-oke-widget]").getAttribute("data-oke-reviews-product-id");
        rec.text = clean(s.textContent).slice(0, 4000);
      } else if (!clean(s.textContent) && !s.querySelector("img,video")) {
        rec.type = "empty";
      } else {
        rec.type = "unknown";
        rec.text = clean(s.textContent).slice(0, 300);
        rec.cls = s.className;
      }
      out.sections.push(rec);
    }
    return out;
  });
  for (const s of data.sections) { s.cssHash = createHash("md5").update(s.css).digest("hex").slice(0, 8); }
  result[h] = data;
  console.log(h, data.template.slice(0, 80), data.sections.filter((s) => s.type !== "empty").map((s) => s.type + ":" + s.cssHash.slice(0, 4)).join(" "));
}
writeFileSync("extracted.json", JSON.stringify(result, null, 1));
await b.close();
