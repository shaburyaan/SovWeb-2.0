#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createServer } from "node:net";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const nextBin = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");

function parseArgs(argv) {
  const options = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];

    if (!current.startsWith("--")) {
      continue;
    }

    const trimmed = current.slice(2);
    const [rawKey, inlineValue] = trimmed.split("=", 2);
    const key = rawKey.replace(/-([a-z])/g, (_, char) => char.toUpperCase());

    if (inlineValue === undefined && argv[index + 1] && !argv[index + 1].startsWith("--")) {
      options[key] = argv[index + 1];
      index += 1;
      continue;
    }

    options[key] = inlineValue ?? true;
  }

  return options;
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isPortFree(port, hostname) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    server.listen(port, hostname);
  });
}

async function pickPort(preferredPort, hostname, fallbackPort) {
  if (await isPortFree(preferredPort, hostname)) {
    return preferredPort;
  }

  if (!fallbackPort) {
    throw new Error(`Port ${preferredPort} is busy.`);
  }

  let candidate = fallbackPort;

  while (!(await isPortFree(candidate, hostname))) {
    candidate += 1;
  }

  return candidate;
}

function logBanner(message) {
  process.stdout.write(`${message}\n`);
}

async function main() {
  if (!fs.existsSync(nextBin)) {
    throw new Error("Next.js is not installed. Run `npm install` first.");
  }

  const args = parseArgs(process.argv.slice(2));
  const mode = typeof args.mode === "string" ? args.mode : "portable";
  const sovranoMode = mode === "sovrano";
  const hostname = typeof args.hostname === "string" ? args.hostname : sovranoMode ? "0.0.0.0" : "localhost";
  const preferredPort = toNumber(args.port, sovranoMode ? 80 : 3000);
  const fallbackPort = args.fallbackPort ? toNumber(args.fallbackPort, 3000) : sovranoMode ? 3000 : undefined;
  const finalPort = await pickPort(preferredPort, hostname, fallbackPort);
  const publicHost = typeof args.publicHost === "string"
    ? args.publicHost
    : sovranoMode
      ? "sovrano.am"
      : hostname === "0.0.0.0"
        ? "localhost"
        : hostname;
  const publicUrl = typeof args.publicUrl === "string" ? args.publicUrl : `http://${publicHost}:${finalPort}`;

  logBanner("");
  logBanner(`Sovrano local mode: ${mode}`);
  logBanner(`Project root: ${repoRoot}`);
  logBanner(`Next dev target: http://${hostname}:${finalPort}`);
  logBanner(`Open in browser: ${publicUrl}`);

  if (finalPort !== preferredPort) {
    logBanner(`Preferred port ${preferredPort} is busy. Falling back to ${finalPort}.`);
  }

  if (sovranoMode && finalPort !== 80) {
    logBanner("sovrano.am:80 is not available on this machine. Fallback port is being used.");
  }

  logBanner("Stop server with Ctrl+C.");
  logBanner("");

  const child = spawn(
    process.execPath,
    [nextBin, "dev", "--hostname", hostname, "--port", String(finalPort)],
    {
      cwd: repoRoot,
      stdio: "inherit",
      env: {
        ...process.env,
        SOVRANO_LOCAL_MODE: mode,
        SOVRANO_PUBLIC_URL: publicUrl,
      },
    },
  );

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  process.stderr.write(`runLocal failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
