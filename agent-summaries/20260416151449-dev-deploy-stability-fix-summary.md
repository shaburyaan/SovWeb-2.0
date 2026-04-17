Deploy stability fix:
- `scripts/deploy-pages.mjs`: clean `.next` + `out` before build/export.
- `next.config.ts`: disable `serverMinification`, disable `prerenderEarlyExit`, enable server sourcemaps to match the stable prerender path on Windows.
- Validation: `npm run build:pages` passed twice after the fix.
