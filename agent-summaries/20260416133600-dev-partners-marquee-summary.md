# Partners marquee summary

- `Our Partners` hero: shared photo background removed, replaced by CSS-only 3-row real-logo marquee.
- Partner source layer: cards and marquee now resolve to logo-priority assets instead of raw legacy poster sources when clean logos exist.
- Runtime: dense grid `RevealText` cost removed on partners cards, heavy foreground light kept only on locale home routes.
- Validation: `npm run build` passed; live checks done on fresh dev `3002` and static export `3004` for `/`, `/our-partners`, `/hy/our-partners`, `/ru/our-partners`, `/garofalo`.
- Note: stale Windows `.next` cache can still produce transient dev-only `500` until a clean restart.
