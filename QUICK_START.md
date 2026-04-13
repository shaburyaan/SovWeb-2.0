# Sovrano Quick Start

## Local Dev

```powershell
npm install
npm run runLocal
```

Default: `http://localhost:3000`

## Sovrano Wrapper

```powershell
devNew
```

`devNew` now calls the repo Next.js runner and starts dev on `http://sovrano.am:80`.

## Git Push

```powershell
pushNew "your message"
```

`pushNew` pushes to [SovWeb-2.0](https://github.com/shaburyaan/SovWeb-2.0).

## Validation

```powershell
npm run prove:legacy-parity
npm run lint
npm run build
```

## Cleanup

```powershell
npm run cleanup:safe
```

Requires a green `prove:legacy-parity` report first.

## Docs

See `README_COMMANDS.md`.
