# Safe Cleanup Inventory

Generated for `safe-cleanup-local-run`.

## Must Keep
- `app/`
- `src/`
- `public/`
- `reports/`
- `wp-content/`
- `package.json`
- `scripts/run-local.mjs`
- `scripts/prove-legacy-parity.mjs`

## Archive First
- `modern-app/`
- `test-results/`
- `optimization-baseline.json`
- `optimization-image-report.json`
- `optimization-post.json`

## Clean Delete Scope
- Root legacy route trees backed by `reports/pages.json`
- `hy/` legacy route trees backed by `reports/pages.json`
- `ru/` legacy route trees backed by `reports/pages.json`
- Root `index.html`

## Guardrails
- Route/content/media parity is proven by `docs/legacy-parity-checklist.md`.
- Current parity verdict: `READY FOR CLEAN DELETE`.
- Legacy HTML delete scope must exclude runtime assets under `public/` and `wp-content/`.
