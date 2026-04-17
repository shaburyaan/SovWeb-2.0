# Sovrano Commands

## Local Runtime

Portable repo runner:

```powershell
npm install
npm run runLocal
```

- Default host: `localhost`
- Default port: `3000`
- If busy, `runLocal` picks the next free port

Custom port:

```powershell
npm run runLocal -- --port 3005
```

## PowerShell Wrappers

If the PowerShell profile is loaded:

```powershell
runLocal
devNew
sovHelp
```

- `runLocal` -> thin wrapper over `npm run runLocal`
- `devNew` -> thin wrapper over `npm run dev:sov`
- `devNew` prefers `http://sovrano.am:80`

## Validation

```powershell
npm run prove:legacy-parity
npm run lint
npm run build
```

- `prove:legacy-parity` writes:
  - `docs/legacy-parity-checklist.md`
  - `docs/legacy-parity-report.json`

## Cleanup

```powershell
npm run cleanup:safe
```

- Archives:
  - `modern-app/`
  - `test-results/`
  - `optimization-*.json`
- Deletes only legacy route `index.html` files after a green parity report
- Writes archive manifest to `_archive/safe-cleanup-20260413/manifest.json`

## Deploy Helpers

Existing profile helpers remain available:

```powershell
pushNew "message"
depSov
```

- `depSov` now builds a static Next.js export and uploads `out/` to Cloudflare Pages

## Notes

- The active runtime is Next.js from repo root.
- Legacy HTML is no longer the runtime.
- `reports/` and runtime-served assets stay source-of-truth for migrated content.
- `pushNew` pushes to [SovWeb-2.0](https://github.com/shaburyaan/SovWeb-2.0).
