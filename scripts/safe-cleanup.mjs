#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const archiveRoot = path.join(repoRoot, "_archive", "safe-cleanup-20260413");
const archiveItems = [
  "modern-app",
  "test-results",
  "optimization-baseline.json",
  "optimization-image-report.json",
  "optimization-post.json",
];
const protectedTopDirs = new Set([".git", ".next", "_archive", "app", "docs", "node_modules", "public", "reports", "scripts", "src", "wp-content"]);

function relativeToRepo(targetPath) {
  return path.relative(repoRoot, targetPath).replace(/\\/g, "/");
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureParentDir(targetPath) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
}

async function moveToArchive(relPath) {
  const sourcePath = path.join(repoRoot, relPath);

  if (!(await pathExists(sourcePath))) {
    return null;
  }

  const destinationPath = path.join(archiveRoot, relPath);
  await ensureParentDir(destinationPath);
  await fs.rename(sourcePath, destinationPath);

  return {
    source: relPath,
    destination: relativeToRepo(destinationPath),
  };
}

async function removeEmptyAncestors(startDir) {
  let currentDir = startDir;

  while (currentDir.startsWith(repoRoot) && currentDir !== repoRoot) {
    const rel = relativeToRepo(currentDir);
    const topDir = rel.split("/")[0];

    if (protectedTopDirs.has(topDir)) {
      return;
    }

    const entries = await fs.readdir(currentDir).catch(() => []);

    if (entries.length > 0) {
      return;
    }

    await fs.rmdir(currentDir);
    currentDir = path.dirname(currentDir);
  }
}

async function main() {
  const parityPath = path.join(repoRoot, "docs", "legacy-parity-report.json");
  const parityReport = JSON.parse(await fs.readFile(parityPath, "utf8"));

  if (parityReport.unresolved) {
    throw new Error("legacy parity report is unresolved. Run `npm run prove:legacy-parity` and fix remaining gaps first.");
  }

  await fs.mkdir(archiveRoot, { recursive: true });

  const movedItems = [];

  for (const relPath of archiveItems) {
    const moved = await moveToArchive(relPath);

    if (moved) {
      movedItems.push(moved);
    }
  }

  const deletedHtmlFiles = [];

  for (const row of parityReport.routeRows) {
    const relPath = row.sourceFile;
    const sourcePath = path.join(repoRoot, relPath);

    if (!(await pathExists(sourcePath))) {
      continue;
    }

    await fs.unlink(sourcePath);
    deletedHtmlFiles.push(relPath);
    await removeEmptyAncestors(path.dirname(sourcePath));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    movedItems,
    deletedHtmlFilesCount: deletedHtmlFiles.length,
    deletedHtmlFiles,
  };

  await fs.writeFile(path.join(archiveRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  process.stdout.write(`Archived ${movedItems.length} items and deleted ${deletedHtmlFiles.length} legacy HTML files.\n`);
}

main().catch((error) => {
  process.stderr.write(`cleanup:safe failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
