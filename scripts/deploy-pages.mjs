#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputDir = path.join(repoRoot, "out");
const nextBuildDir = path.join(repoRoot, ".next");
const nextCliPath = path.join(repoRoot, "node_modules", "next", "dist", "bin", "next");
const projectName = "sovrano-website";
const branchName = "main";
const isBuildOnly = process.argv.includes("--build-only");
const textExtensions = new Set([".css", ".html", ".js", ".json", ".txt", ".xml"]);

function quoteWindowsArg(value) {
  if (!/[\s"]/u.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '\\"')}"`;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child =
      process.platform === "win32"
        ? path.isAbsolute(command)
          ? spawn(command, args, {
              cwd: repoRoot,
              stdio: "inherit",
              ...options,
            })
          : spawn(
              process.env.ComSpec ?? "cmd.exe",
              ["/d", "/s", "/c", [command, ...args].map(quoteWindowsArg).join(" ")],
              {
                cwd: repoRoot,
                stdio: "inherit",
                ...options,
              },
            )
        : spawn(command, args, {
            cwd: repoRoot,
            stdio: "inherit",
            ...options,
          });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code ?? "unknown"}`));
    });
  });
}

async function copyIfExists(fileName) {
  const source = path.join(repoRoot, fileName);
  const target = path.join(outputDir, fileName);

  try {
    await fs.access(source);
  } catch {
    return;
  }

  await fs.copyFile(source, target);
}

async function copyDirectory(sourceDir, targetDir) {
  await fs.mkdir(targetDir, { recursive: true });
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
      continue;
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
  }
}

async function walkFiles(targetDir) {
  const entries = await fs.readdir(targetDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkFiles(entryPath)));
      continue;
    }

    files.push(entryPath);
  }

  return files;
}

function normalizeAssetPath(assetPath) {
  return assetPath.split(/[?#]/, 1)[0]?.replace(/\\/g, "/") ?? "";
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function removeDirectory(targetPath) {
  if (!(await pathExists(targetPath))) {
    return;
  }

  await fs.rm(targetPath, {
    recursive: true,
    force: true,
    maxRetries: 4,
    retryDelay: 250,
  });
}

async function copyReferencedAssets() {
  const files = await walkFiles(outputDir);
  const referencedAssets = new Set();

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();

    if (!textExtensions.has(extension)) {
      continue;
    }

    const content = await fs.readFile(filePath, "utf8");

    for (const match of content.matchAll(/\/[^"'()\s]+?\.(?:avif|gif|ico|jpeg|jpg|mov|mp4|png|svg|webm|webp)(?:[?#][^"'()\s]*)?/gi)) {
      const assetPath = normalizeAssetPath(match[0]);

      if (!assetPath || assetPath.startsWith("/_next/")) {
        continue;
      }

      referencedAssets.add(assetPath);
    }
  }

  for (const assetPath of referencedAssets) {
    const relativePath = assetPath.replace(/^\/+/, "");
    const candidates = [
      path.join(repoRoot, relativePath),
      path.join(repoRoot, "public", relativePath),
    ];

    for (const candidate of candidates) {
      if (!(await pathExists(candidate))) {
        continue;
      }

      const stats = await fs.stat(candidate);
      const targetPath = path.join(outputDir, relativePath);

      if (stats.isDirectory()) {
        await copyDirectory(candidate, targetPath);
      } else {
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.copyFile(candidate, targetPath);
      }

      break;
    }
  }
}

async function main() {
  process.stdout.write("Cleaning previous .next and out artifacts...\n");
  await removeDirectory(nextBuildDir);
  await removeDirectory(outputDir);
  await run(process.execPath, [nextCliPath, "build"]);
  await copyIfExists("_headers");
  await copyIfExists("_redirects");
  await copyReferencedAssets();

  if (isBuildOnly) {
    process.stdout.write("Cloudflare Pages output prepared in ./out\n");
    return;
  }

  await run("wrangler", [
    "pages",
    "deploy",
    "out",
    "--project-name",
    projectName,
    "--branch",
    branchName,
    "--commit-dirty=true",
  ]);
}

main().catch((error) => {
  process.stderr.write(`deploy:pages failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
