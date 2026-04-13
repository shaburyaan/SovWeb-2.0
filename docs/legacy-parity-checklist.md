# Legacy Parity Checklist

Generated: 2026-04-13T15:24:16.158Z

## Summary
- Legacy HTML routes: 129
- Migrated routes: 129
- Intentionally dropped routes: 0
- Needs-fix routes: 0
- Migrated routes with media gaps: 0
- Report-only routes: 0
- Verdict: READY FOR CLEAN DELETE

## Must Keep
- `reports/`
- `wp-content/`
- `public/wp-content/`
- `src/`
- `app/`
- `public/` runtime assets mirrored from legacy media

## Archive First Candidates
- `modern-app/`
- `test-results/`
- `optimization-baseline.json`
- `optimization-image-report.json`
- `optimization-post.json`

## Legacy Route Status
_None_

## Migrated Routes With Missing Assets
_None_

## Broken Legacy Asset References
_None_

## Report-Only Routes
_None_

## Notes
- `migrated` means the legacy source route is represented in `reports/pages.json` and the runtime can consume it.
- `intentionally dropped` is limited to archive-like WordPress routes outside the target IA.
- Clean deletion of legacy HTML is allowed only when `needs-fix`, `media gaps`, and `report-only routes` are all zero.
