# Site Optimization Report

- generated: 2026-02-13T14:32:37.263468
- source images processed: 343 (failed: 0)
- source bytes: 21932759
- webp bytes: 12381378 (saving: 9551381)
- avif bytes: 8037819 (saving: 13894940)

## Key Pages Diff (baseline -> post)

- `index.html`
  - html bytes: 575953 -> 580702
  - asset refs: 105 -> 154
  - referenced asset bytes: 3357603 -> 3925542
  - missing refs: 65 -> 65
- `ru/index.html`
  - html bytes: 601218 -> 605951
  - asset refs: 105 -> 154
  - referenced asset bytes: 3386227 -> 3922295
  - missing refs: 65 -> 65
- `hy/index.html`
  - html bytes: 596309 -> 601042
  - asset refs: 106 -> 155
  - referenced asset bytes: 3431607 -> 3967675
  - missing refs: 65 -> 65
- `our-partners/index.html`
  - html bytes: 560472 -> 575023
  - asset refs: 118 -> 191
  - referenced asset bytes: 2299163 -> 3332412
  - missing refs: 67 -> 67

## Implemented

- Added safe image pipeline (`optimize-images.js`) generating WebP + AVIF sidecars; originals kept untouched.
- Added reusable audit tool (`scripts/perf-audit.js`) for baseline/post snapshots.
- Updated key pages (`index`, `ru/index`, `hy/index`, `our-partners/index`) to use `<picture>` with AVIF/WebP fallback to original images.
- Added global UX stylesheet (`assets/site-ux.css`) and injected it into site HTML pages.
- Hardened cache/security headers in `_headers`; kept `_redirects` chain-safe and explicit.

## Notes

- Lighthouse LCP/CLS/TBT is not included in this report (CLI not available in environment).
- Missing image refs from existing content remain unchanged and are not caused by optimization changes.