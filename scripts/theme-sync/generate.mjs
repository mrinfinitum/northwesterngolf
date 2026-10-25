// node generate.mjs <outfile.ts>  -- builds typed static product template content from extracted.json
import { readFileSync, writeFileSync } from "node:fs";
import { roleMap } from "./cssvars.mjs";

const d = JSON.parse(readFileSync("extracted.json", "utf8"));
const out = process.argv[2];

const FILES = "https://cdn.shopify.com/s/files/1/0728/0869/3923/";
const cdn = (u) => {
  if (!u) return u;
  let url = u.replace(/^\/\//, "https://");
  url = url.replace("https://northwestern.golf/cdn/shop/videos/", "https://cdn.shopify.com/videos/");
  url = url.replace("https://northwestern.golf/cdn/shop/", FILES);
  return url;
};
const cleanHtml = (h) => (h || "")
  .replace(/\s+/g, " ")
  .replace(/> </g, "><")
  .replace(/<br>\s*<\/p>/g, "</p>")
  .replace(/src="\/\//g, 'src="https://')
  .trim();
const text = (h) => h.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const num = (s) => Number(String(s).replace("s", ""));

function videoOf(v) {
  if (!v) return { sources: [] };
  const mp4 = v.sources.filter((s) => s.type === "video/mp4").map((s) => ({ src: cdn(s.src).replace(/\?v=0$/, ""), type: "video/mp4" }));
  const hls = v.sources.filter((s) => /mpegurl/i.test(s.type)).map((s) => ({ src: cdn(s.src).replace(/\?v=0$/, ""), type: "application/x-mpegURL" }));
  const o = { sources: [...hls, ...mp4] };
  if (v.poster) o.poster = cdn(v.poster);
  return o;
}

// split tile style vars: role.prop -> css var
const SPLIT_VARS = {
  "media-left": {
    "content-image.width": "--bar-w",
    "content-image.max-width": "--bar-max",
    "content-image.margin-top": "--bar-mt",
    "content-image.margin-bottom": "--bar-mb",
    "heading.font-size": "--h-size",
    "heading.line-height": "--h-lh",
    "heading.margin-top": "--h-mt",
    "heading.margin-bottom": "--h-mb",
    "heading.font-size@m": "--h-size-m",
    "text.font-size": "--t-size",
    "text.line-height": "--t-lh",
    "text.margin-top": "--t-mt",
    "text.margin-bottom": "--t-mb",
    "text.font-size@m": "--t-size-m",
  },
  "media-right": {
    "optional-image.width": "--bar-w",
    "optional-image.max-width": "--bar-max",
    "optional-image.margin-top": "--bar-mt",
    "optional-image.margin-bottom": "--bar-mb",
    "optional-image.margin-top@m": "--bar-mt-m",
    "optional-image.margin-bottom@m": "--bar-mb-m",
    "heading.font-size": "--h-size",
    "heading.line-height": "--h-lh",
    "heading.font-size@m": "--h-size-m",
    "heading.line-height@m": "--h-lh-m",
    "spacing.height": "--gap",
    "spacing.height@m": "--gap-m",
    "body.font-size": "--t-size",
    "body.line-height": "--t-lh",
    "body.font-size@m": "--t-size-m",
    "body.line-height@m": "--t-lh-m",
    "body.margin-bottom@m": "--t-mb-m",
    "text-container.padding@m": "--pad-m",
    "container.min-height@m": "--min-h-m",
  },
};

// compute defaults (mode) per layout
const tiles = [];
for (const p of Object.values(d)) for (const s of p.sections) if (s.type === "split") tiles.push(s);
const defaults = {};
for (const layout of Object.keys(SPLIT_VARS)) {
  const counts = {};
  for (const s of tiles) {
    if ((s.mediaFirst ? "media-left" : "media-right") !== layout) continue;
    const m = roleMap(s.css, "ai-split-layout");
    for (const k of Object.keys(SPLIT_VARS[layout])) {
      const v = m[k] ?? "";
      ((counts[k] ??= {})[v] = (counts[k][v] || 0) + 1);
    }
  }
  defaults[layout] = Object.fromEntries(Object.entries(counts).map(([k, c]) => [k, Object.entries(c).sort((a, b) => b[1] - a[1])[0][0]]));
}

function convertSection(s) {
  switch (s.type) {
    case "marquee": {
      const dur = num((s.css.match(/animation: \S+ (\d+)s/) || [])[1] || 90);
      const mob = num((s.css.match(/animation-duration: (\d+)s/) || [])[1] || dur);
      const o = { type: "marquee", text: s.text, icon: cdn(s.icon), duration: { desktop: dur, mobile: mob } };
      if (s.background) o.background = cdn(s.background);
      return o;
    }
    case "editorialGrid":
      return { type: "editorialGrid", columns: s.columns.map((c) => ({ image: cdn(c.image), heading: c.heading, bodyHtml: cleanHtml(c.body) })) };
    case "instafeed":
      return { type: "socialFeed" };
    case "imagesScrolling":
      return { type: "pressScroller", items: s.items.map((i) => ({ image: cdn(i.image), quote: text(i.html) })) };
    case "split": {
      const layout = s.mediaFirst ? "media-left" : "media-right";
      const m = roleMap(s.css, "ai-split-layout");
      const style = {};
      for (const [k, v] of Object.entries(SPLIT_VARS[layout])) {
        if ((m[k] ?? "") !== defaults[layout][k] && m[k] !== undefined) style[v] = m[k];
      }
      const o = { type: "splitTile", layout, video: videoOf(s.video), barImage: cdn(s.images[0]), heading: s.heading, bodyHtml: cleanHtml(s.bodyHtml) };
      if (Object.keys(style).length) o.style = style;
      return o;
    }
    case "richText": {
      const h = s.html.match(/<p class="h3[^"]*">([\s\S]*?)<\/p>/);
      const body = s.html.replace(/<p class="h3[^"]*">[\s\S]*?<\/p>/, "").replace(/^<div>|<\/div>$/g, "");
      return { type: "richText", heading: text(h ? h[1] : ""), bodyHtml: cleanHtml(body) };
    }
    case "video":
      return { type: "featureVideo", video: videoOf(s.video) };
    case "faq":
      return { type: "faq", heading: s.heading, subheading: s.subheading, items: s.items.map((i) => ({ question: i.q, answerHtml: cleanHtml(i.a), ...(i.open ? { open: true } : {}) })) };
    case "related":
      return { type: "relatedProducts", heading: s.heading, handles: s.handles };
    case "reviews":
      return { type: "reviews" };
    default:
      return null;
  }
}

const OFFER_ICON = { "icon-picto-timer": "timer", "icon-picto-shield": "shield", "icon-picto-box": "box" };
const templates = {};
for (const [handle, p] of Object.entries(d)) {
  const main = p.sections.find((s) => s.type === "main");
  const info = {
    introHtml: cleanHtml(main.textHtml) || null,
    offers: main.offers.map((o) => ({ icon: OFFER_ICON[(o.svg.match(/icon-picto-[a-z-]+/) || [])[0]] || "shield", text: o.text })),
    govx: main.govx,
    ...(main.rating ? { rating: { count: Number((main.rating.title.match(/\d+/) || [0])[0]), value: Number(main.rating.value) } } : {}),
    accordions: main.accordions.map((a) => ({ title: a.title, html: cleanHtml(a.html) })),
  };
  const sections = p.sections.flatMap((s) => {
    const converted = convertSection(s);
    if (!converted) return [];
    return s.alsoInstafeed ? [converted, { type: "socialFeed" }] : [converted];
  });
  templates[handle] = { info, sections };
}

// dedupe sections shared by 2+ products into named constants
const counts = new Map();
for (const t of Object.values(templates)) for (const s of t.sections) { const k = JSON.stringify(s); counts.set(k, (counts.get(k) || 0) + 1); }
const shared = new Map();
const typeCounters = {};
for (const [k, c] of counts) {
  if (c < 2) continue;
  const s = JSON.parse(k);
  const base = s.type === "marquee" ? `marquee_${s.text.replace(/[^a-z0-9]+/gi, "_").toLowerCase().replace(/^_|_$/g, "")}_${s.duration.desktop}s_${s.duration.mobile}s` : s.type;
  typeCounters[base] = (typeCounters[base] || 0) + 1;
  shared.set(k, `${base}${typeCounters[base] > 1 ? "_" + typeCounters[base] : ""}`.replace(/_([a-z0-9])/g, (_, ch) => ch.toUpperCase()));
}
// rename single-instance shared names without suffix fine; ensure first gets no suffix
const ts = (v) => JSON.stringify(v, null, 2).replace(/^(\s*)"([a-zA-Z_][a-zA-Z0-9_]*)":/gm, "$1$2:");
let code = `/**
 * Product-page template content mirrored from the live Shopify theme
 * (northwestern.golf, Impact v6.11.2 per-product templates), captured ${new Date().toISOString().slice(0, 10)}.
 *
 * GENERATED from rendered live markup. The Storefront API cannot read the
 * template/metafield content without a private token, so it is kept here as
 * typed static data keyed by product handle. Media URLs point at the Shopify
 * CDN. Replace with a metafield/metaobject source in ./index.ts when available.
 */
import type { PdpSection, ProductPageTemplate } from "./types";

`;
for (const [k, name] of shared) code += `const ${name}: PdpSection = ${ts(JSON.parse(k))};\n\n`;
code += `export const PRODUCT_TEMPLATES: Record<string, ProductPageTemplate> = {\n`;
for (const [handle, t] of Object.entries(templates)) {
  const secs = t.sections.map((s) => { const k = JSON.stringify(s); return shared.has(k) ? shared.get(k) : ts(s); });
  code += `  ${JSON.stringify(handle)}: {\n    id: ${JSON.stringify(handle)},\n    info: ${ts(t.info).replace(/\n/g, "\n    ")},\n    sections: [\n      ${secs.map((x) => x.replace(/\n/g, "\n      ")).join(",\n      ")},\n    ],\n  },\n`;
}
code += `};\n`;
writeFileSync(out, code);
console.log("templates", Object.keys(templates).length, "shared", shared.size, [...shared.values()].join(" "));
console.log("defaults", JSON.stringify(defaults));
