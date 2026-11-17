import "server-only";

import sanitizeHtml from "sanitize-html";

/**
 * Rich text authored in Shopify Admin (policy, page and blog bodies) is rendered with
 * dangerouslySetInnerHTML, and the CSP allows inline script (static rendering, no
 * nonces). Anyone with Shopify content access, or an app with write_content, could
 * otherwise run script on this site via `onerror=` and the like. Keep formatting,
 * links and images; drop scripts, event handlers, iframes, forms and unsafe URLs.
 */
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "h1",
    "h2",
    "img",
    "picture",
    "source",
    "figure",
    "figcaption",
    "del",
    "ins",
    "sub",
    "sup",
    "u",
  ],
  allowedAttributes: {
    "*": ["class", "id", "style", "title", "dir", "lang", "aria-*", "data-*"],
    a: ["href", "name", "target", "rel"],
    img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "decoding"],
    source: ["srcset", "sizes", "type", "media"],
    ol: ["start", "type", "reversed"],
    td: ["colspan", "rowspan", "align", "valign"],
    th: ["colspan", "rowspan", "align", "valign", "scope"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"], source: ["http", "https"] },
  allowProtocolRelative: true,
  // Inline styles are layout/typography only: nothing that can load URLs or overlay the page.
  allowedStyles: {
    "*": Object.fromEntries(
      [
        "color",
        "background-color",
        "font-size",
        "font-weight",
        "font-style",
        "line-height",
        "letter-spacing",
        "text-align",
        "text-decoration",
        "text-transform",
        "vertical-align",
        "white-space",
        "width",
        "max-width",
        "height",
        "margin",
        "margin-top",
        "margin-right",
        "margin-bottom",
        "margin-left",
        "padding",
        "padding-top",
        "padding-right",
        "padding-bottom",
        "padding-left",
        "border",
        "border-collapse",
        "list-style-type",
        "display",
      ].map((property) => [property, [/^[-#%.,()\w\s]+$/]]),
    ),
  },
  transformTags: {
    // Links that open a new tab can't reach back into this page.
    a: (tagName, attribs) =>
      attribs.target === "_blank" ? { attribs: { ...attribs, rel: "noopener noreferrer" }, tagName } : { attribs, tagName },
  },
};

export function sanitizeShopifyHtml(html: string) {
  return sanitizeHtml(html, OPTIONS);
}
