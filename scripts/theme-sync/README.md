# Theme content sync

Product page template content (taglines, accordions, feature cards, marquees,
FAQ, press quotes) lives in Shopify theme templates, not in Storefront API data
that is readable without a token. These scripts mirror it from the live
storefront into `src/lib/product-content/templates.ts`.

Run from a scratch directory with Playwright available (it is not a project
dependency):

```bash
mkdir -p /tmp/theme-sync && cp scripts/theme-sync/*.mjs /tmp/theme-sync/
cd /tmp/theme-sync && npm init -y >/dev/null && npm i playwright@1 && npx playwright install chromium
node products.mjs                                   # products.json
node dump.mjs $(node -e 'console.log(require("./products.json").data.products.nodes.map(p=>p.handle).join(" "))')
node extract.mjs                                    # extracted.json
node generate.mjs "$OLDPWD/src/lib/product-content/templates.ts"
```

`dump.mjs` paces requests because northwestern.golf rate-limits automated
traffic; it skips handles already dumped under `live/`. Review the generated
diff before committing.

Once a Storefront token with `unauthenticated_read_metafields` exists, this
content can move to product metafields/metaobjects and be read at request time
behind `getProductPageContent()` instead.
