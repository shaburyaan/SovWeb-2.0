# SovWeb-2.0

Next.js 15 runtime for the redesigned Sovrano website.

This repository no longer uses legacy HTML as the active UI. The current runtime lives at repo root and renders the website from structured legacy content sources in `reports/`, with a new motion-driven interface built on React, Tailwind, Framer Motion, GSAP, and Lenis.

## Stack

- Next.js 15 App Router
- React 19
- Tailwind CSS 4
- Framer Motion
- GSAP + ScrollTrigger
- Lenis
- TypeScript

## What Is Inside

- Cinematic homepage and internal page runtime
- Locale-aware content rendering for English, Armenian, and Russian
- Structured adapters over legacy content manifests in `reports/`
- Safe cleanup/parity tooling for migrated legacy content
- Portable local runner plus PowerShell wrappers

## Local Development

Install dependencies and start the portable local server:

```bash
npm install
npm run runLocal
```

Default local URL:

```text
http://localhost:3000
```

If your PowerShell profile is loaded, you can also use:

```powershell
devNew
```

`devNew` runs the same repo-controlled Next.js workflow and prefers `http://sovrano.am:80`.

## Common Commands

```bash
npm run runLocal
npm run build
npm run lint
npm run prove:legacy-parity
npm run cleanup:safe
```

PowerShell helpers:

```powershell
devNew
pushNew "your commit message"
depSov
```

- `pushNew` pushes to this repository
- `depSov` remains the Cloudflare deploy helper and deploys `out/`
## Content And Cleanup

The migrated runtime keeps `reports/` and runtime-served assets as source-of-truth.

Legacy cleanup and parity artifacts:

- `docs/legacy-parity-checklist.md`
- `docs/legacy-parity-report.json`
- `docs/safe-cleanup-inventory.md`

## Important Notes

- Legacy HTML is no longer the active runtime
- Root runtime is production-oriented Next.js, not WordPress
- Cleanup should only run after a green parity report

## Docs

- `QUICK_START.md`
- `README_COMMANDS.md`
- `RUNBOOK.md`

## Website

- Production: [https://sovrano.am](https://sovrano.am)
- Repository: [https://github.com/shaburyaan/SovWeb-2.0](https://github.com/shaburyaan/SovWeb-2.0)
