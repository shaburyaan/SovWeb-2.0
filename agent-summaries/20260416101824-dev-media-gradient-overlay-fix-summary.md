Media/gradient/overlay fix completed.

- Routed homepage, generic, detail, and vacancy hero/media surfaces through `getOptimizedAssetSrc()`.
- Extended `optimized-media` coverage for remaining raw locale and legacy assets, then regenerated targeted media plus `logo` / `logo-g`.
- Upgraded `prepare-optimized-media.py` to merge manifest updates and clean internal white islands for logo-style assets.
- Added a visible global light layer with stronger homepage glow treatment and hardened page-transition teardown with a fail-safe reset.
- Revalidated `npm run build:pages`; `out/**/*.html` no longer contains raw image preloads.
