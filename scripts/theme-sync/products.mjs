// usage: node products.mjs  -> writes products.json (all product handles) from the tokenless Storefront API
import { writeFileSync } from "node:fs";
const res = await fetch("https://r1kikk-am.myshopify.com/api/2026-07/graphql.json", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: "{ products(first: 250) { nodes { handle } } }" }),
});
writeFileSync("products.json", JSON.stringify(await res.json(), null, 1));
