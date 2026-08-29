# Northwestern Golf headless storefront

Next.js 16 retail storefront foundation backed by Shopify's Storefront API.
Shopify remains the system of record; cart, checkout handoff, customer-aware
pricing, wholesale, and customer authentication are intentionally gated.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `SHOPIFY_STORE_DOMAIN` to the permanent `*.myshopify.com` domain.
3. Add a Storefront API token only if the requested fields require one.
4. Run `npm run dev` and open `http://localhost:3000`.

Public catalog fields used by this phase can be read tokenlessly on the current
store configuration. Tokens and revalidation secrets must never use a
`NEXT_PUBLIC_` prefix.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

See [`docs/build-phase-1.md`](docs/build-phase-1.md) for scope, evidence,
deferred commerce behavior, and next steps.
