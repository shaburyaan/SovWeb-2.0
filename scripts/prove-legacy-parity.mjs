#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const pagesPath = path.join(repoRoot, "reports", "pages.json");
const docsDir = path.join(repoRoot, "docs");
const markdownOutputPath = path.join(docsDir, "legacy-parity-checklist.md");
const jsonOutputPath = path.join(docsDir, "legacy-parity-report.json");

const excludedTopDirs = new Set([
  ".git",
  ".next",
  "_archive",
  "app",
  "coverage",
  "docs",
  "modern-app",
  "node_modules",
  "public",
  "src",
  "wp-content",
  "cdn-cgi",
]);

const intentionallyDroppedPatterns = [
  /^\/author\//i,
  /^\/category\//i,
  /^\/hy\/author\//i,
  /^\/hy\/category\//i,
  /^\/ru\/author\//i,
  /^\/ru\/category\//i,
  /^\/tag\//i,
];

const runtimeRouteAssetCoverage = {
  "/": ["/homepage/01.jpg", "/homepage/03.JPG"],
  "/hy/": ["/homepage/01.jpg", "/homepage/03.JPG"],
  "/ru/": ["/homepage/01.jpg", "/homepage/03.JPG"],
  "/vacancy/": ["/homepage/03.JPG"],
  "/ru/vacancy/": ["/homepage/03.JPG"],
  "/sladonezh/": ["/wp-content/uploads/2022/09/sladonezh-hero-bg.jpg"],
  "/hy/sladonezh/": ["/wp-content/uploads/2022/09/sladonezh-hero-bg.jpg"],
  "/ru/sladonezh/": ["/wp-content/uploads/2022/09/sladonezh-hero-bg.jpg"],
};

const mediaExtPattern = /\.(avif|gif|ico|jpe?g|mov|mp4|png|svg|webm|webp)(?:\?|#|$)/i;

function normalizeSlashes(value) {
  return value.replace(/\\/g, "/");
}

function normalizeRouteFromPath(relPath) {
  const cleaned = normalizeSlashes(relPath).replace(/\/index\.html$/i, "").replace(/^index\.html$/i, "");
  return cleaned ? `/${cleaned}/` : "/";
}

function normalizeAssetSrc(src) {
  return src
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/\/index\.html$/i, "/")
    .replace(/index\.html$/i, "")
    .replace(/\/+/g, "/")
    .trim();
}

function resolveAssetPath(src, sourceFile = "index.html") {
  if (!src) {
    return "";
  }

  const normalizedSource = src.trim().replace(/^['"]|['"]$/g, "");

  if (/^(homepage|logo|logo-g|wp-content)\//i.test(normalizedSource)) {
    return normalizeAssetSrc(`/${normalizedSource}`);
  }

  try {
    const baseDir = normalizeSlashes(path.posix.dirname(normalizeSlashes(sourceFile)));
    const basePath = baseDir === "." ? "/" : `/${baseDir}/`;
    const resolved = new URL(normalizedSource, `https://sovrano.local${basePath}`);
    return normalizeAssetSrc(resolved.pathname);
  } catch {
    return normalizeAssetSrc(normalizedSource);
  }
}

function isContentAsset(src) {
  const normalized = normalizeAssetSrc(src);
  return normalized !== "" && !normalized.startsWith("data:") && mediaExtPattern.test(normalized);
}

function parseAssetCandidates(rawValue, sourceFile) {
  return rawValue
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0] ?? "")
    .map((part) => resolveAssetPath(part, sourceFile))
    .filter(isContentAsset);
}

function extractAssetsFromHtml(html, sourceFile) {
  const assets = new Set();
  const attrPattern = /\b(?:src|poster|data-src|data-lazy-src|srcset)=["']([^"']+)["']/gi;
  const stylePattern = /url\(([^)]+)\)/gi;

  for (const match of html.matchAll(attrPattern)) {
    for (const candidate of parseAssetCandidates(match[1], sourceFile)) {
      assets.add(candidate);
    }
  }

  for (const match of html.matchAll(stylePattern)) {
    const raw = match[1].replace(/^['"]|['"]$/g, "").trim();
    const normalized = resolveAssetPath(raw, sourceFile);

    if (normalized && isContentAsset(normalized)) {
      assets.add(normalized);
    }
  }

  return [...assets].sort();
}

function extractAssetsFromPage(page) {
  const assets = new Set();
  const sourceFile = normalizeSlashes(page.sourceFile ?? "index.html");

  if (Array.isArray(page.images)) {
    for (const image of page.images) {
      if (image?.src) {
        assets.add(resolveAssetPath(image.src, sourceFile));
      }

      if (image?.srcset) {
        for (const candidate of parseAssetCandidates(String(image.srcset), sourceFile)) {
          assets.add(candidate);
        }
      }
    }
  }

  for (const chunk of collectStringValues(page)) {
    for (const asset of extractAssetsFromHtml(String(chunk), sourceFile)) {
      assets.add(asset);
    }
  }

  for (const asset of runtimeRouteAssetCoverage[page.route] ?? []) {
    assets.add(normalizeAssetSrc(asset));
  }

  return [...assets].filter(Boolean).sort();
}

async function walkForLegacyHtml(rootDir, currentRel = "") {
  const currentDir = path.join(rootDir, currentRel);
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const relPath = normalizeSlashes(path.join(currentRel, entry.name));

    if (entry.isDirectory()) {
      if (!currentRel && excludedTopDirs.has(entry.name)) {
        continue;
      }

      results.push(...(await walkForLegacyHtml(rootDir, relPath)));
      continue;
    }

    if (entry.isFile() && /(^|\/)index\.html$/i.test(relPath)) {
      results.push(relPath);
    }
  }

  return results;
}

function getRouteStatus(route) {
  if (intentionallyDroppedPatterns.some((pattern) => pattern.test(route))) {
    return {
      status: "intentionally dropped",
      note: "WordPress archive/search route outside target IA.",
    };
  }

  return {
    status: "needs-fix",
    note: "Legacy route is not mapped by the runtime manifest.",
  };
}

function relativeToRepo(filePath) {
  return normalizeSlashes(path.relative(repoRoot, filePath));
}

async function assetExistsInRepo(assetPath) {
  const repoCandidate = path.join(repoRoot, assetPath.replace(/^\/+/, ""));
  const publicCandidate = path.join(repoRoot, "public", assetPath.replace(/^\/+/, ""));

  try {
    await fs.access(repoCandidate);
    return true;
  } catch {
    try {
      await fs.access(publicCandidate);
      return true;
    } catch {
      return false;
    }
  }
}

function renderRouteTable(items) {
  if (!items.length) {
    return "_None_";
  }

  return [
    "| Route | Status | Source | Note |",
    "| --- | --- | --- | --- |",
    ...items.map((item) => `| \`${item.route}\` | ${item.status} | \`${item.sourceFile}\` | ${item.note || ""} |`),
  ].join("\n");
}

function collectStringValues(value, collector = []) {
  if (typeof value === "string") {
    collector.push(value);
    return collector;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectStringValues(item, collector);
    }

    return collector;
  }

  if (value && typeof value === "object") {
    for (const nestedValue of Object.values(value)) {
      collectStringValues(nestedValue, collector);
    }
  }

  return collector;
}

async function main() {
  const pages = JSON.parse(await fs.readFile(pagesPath, "utf8"));
  const legacyHtmlFiles = (await walkForLegacyHtml(repoRoot)).sort((left, right) => left.localeCompare(right));
  const pagesByRoute = new Map(Object.entries(pages));
  const pagesBySourceFile = new Map(
    Object.values(pages).map((page) => [normalizeSlashes(page.sourceFile), page]),
  );
  const routeRows = [];
  const missingAssets = [];
  const brokenLegacyAssets = [];

  for (const relPath of legacyHtmlFiles) {
    const route = normalizeRouteFromPath(relPath);
    const sourcePage = pagesBySourceFile.get(relPath);
    const routePage = pagesByRoute.get(route);

    if (sourcePage || routePage) {
      const page = sourcePage ?? routePage;
      const html = await fs.readFile(path.join(repoRoot, relPath), "utf8");
      const htmlAssets = extractAssetsFromHtml(html, relPath);
      const pageAssets = extractAssetsFromPage(page);
      const absentAssets = htmlAssets.filter((asset) => !pageAssets.includes(asset));
      const existingMissingAssets = [];
      const brokenMissingAssets = [];

      for (const asset of absentAssets) {
        if (await assetExistsInRepo(asset)) {
          existingMissingAssets.push(asset);
        } else {
          brokenMissingAssets.push(asset);
        }
      }

      routeRows.push({
        route,
        sourceFile: relPath,
        reportRoute: page.route,
        reportSourceFile: normalizeSlashes(page.sourceFile),
        sourceFileMatch: Boolean(sourcePage),
        status: "migrated",
        note: sourcePage ? "Source file and route are represented in reports/pages.json." : "Route is represented in reports/pages.json.",
        htmlAssetCount: htmlAssets.length,
        reportAssetCount: pageAssets.length,
        missingAssets: existingMissingAssets,
        brokenLegacyAssets: brokenMissingAssets,
      });

      if (existingMissingAssets.length) {
        missingAssets.push({
          route,
          sourceFile: relPath,
          missingAssets: existingMissingAssets,
        });
      }

      if (brokenMissingAssets.length) {
        brokenLegacyAssets.push({
          route,
          sourceFile: relPath,
          missingAssets: brokenMissingAssets,
        });
      }

      continue;
    }

    const fallback = getRouteStatus(route);
    routeRows.push({
      route,
      sourceFile: relPath,
      reportRoute: null,
      reportSourceFile: null,
      sourceFileMatch: false,
      status: fallback.status,
      note: fallback.note,
      htmlAssetCount: 0,
      reportAssetCount: 0,
      missingAssets: [],
      brokenLegacyAssets: [],
    });
  }

  const missingReportRoutes = [...pagesByRoute.keys()]
    .filter((route) => route !== "/" && !routeRows.some((row) => row.route === route && row.status === "migrated"))
    .sort((left, right) => left.localeCompare(right));
  const routeSummary = {
    totalLegacyRoutes: routeRows.length,
    migrated: routeRows.filter((row) => row.status === "migrated").length,
    intentionallyDropped: routeRows.filter((row) => row.status === "intentionally dropped").length,
    needsFix: routeRows.filter((row) => row.status === "needs-fix").length,
    migratedWithAssetGaps: missingAssets.length,
    migratedWithBrokenLegacyRefs: brokenLegacyAssets.length,
    reportOnlyRoutes: missingReportRoutes.length,
  };
  const unresolved = routeSummary.needsFix > 0 || missingAssets.length > 0 || missingReportRoutes.length > 0;
  const generatedAt = new Date().toISOString();

  await fs.mkdir(docsDir, { recursive: true });

  const markdown = [
    "# Legacy Parity Checklist",
    "",
    `Generated: ${generatedAt}`,
    "",
    "## Summary",
    `- Legacy HTML routes: ${routeSummary.totalLegacyRoutes}`,
    `- Migrated routes: ${routeSummary.migrated}`,
    `- Intentionally dropped routes: ${routeSummary.intentionallyDropped}`,
    `- Needs-fix routes: ${routeSummary.needsFix}`,
    `- Migrated routes with media gaps: ${routeSummary.migratedWithAssetGaps}`,
    `- Report-only routes: ${routeSummary.reportOnlyRoutes}`,
    `- Verdict: ${unresolved ? "NOT READY FOR CLEAN DELETE" : "READY FOR CLEAN DELETE"}`,
    "",
    "## Must Keep",
    "- `reports/`",
    "- `wp-content/`",
    "- `public/wp-content/`",
    "- `src/`",
    "- `app/`",
    "- `public/` runtime assets mirrored from legacy media",
    "",
    "## Archive First Candidates",
    "- `modern-app/`",
    "- `test-results/`",
    "- `optimization-baseline.json`",
    "- `optimization-image-report.json`",
    "- `optimization-post.json`",
    "",
    "## Legacy Route Status",
    renderRouteTable(routeRows.filter((row) => row.status !== "migrated")),
    "",
    "## Migrated Routes With Missing Assets",
    missingAssets.length
      ? missingAssets
          .map((item) => [`### \`${item.route}\``, "", ...item.missingAssets.map((asset) => `- \`${asset}\``), ""].join("\n"))
          .join("\n")
      : "_None_",
    "",
    "## Broken Legacy Asset References",
    brokenLegacyAssets.length
      ? brokenLegacyAssets
          .map((item) => [`### \`${item.route}\``, "", ...item.missingAssets.map((asset) => `- \`${asset}\``), ""].join("\n"))
          .join("\n")
      : "_None_",
    "",
    "## Report-Only Routes",
    missingReportRoutes.length ? missingReportRoutes.map((route) => `- \`${route}\``).join("\n") : "_None_",
    "",
    "## Notes",
    "- `migrated` means the legacy source route is represented in `reports/pages.json` and the runtime can consume it.",
    "- `intentionally dropped` is limited to archive-like WordPress routes outside the target IA.",
    "- Clean deletion of legacy HTML is allowed only when `needs-fix`, `media gaps`, and `report-only routes` are all zero.",
    "",
  ].join("\n");

  const report = {
    generatedAt,
    routeSummary,
    unresolved,
    routeRows,
    missingAssets,
    brokenLegacyAssets,
    missingReportRoutes,
    outputs: {
      markdown: relativeToRepo(markdownOutputPath),
      json: relativeToRepo(jsonOutputPath),
    },
  };

  await fs.writeFile(markdownOutputPath, markdown);
  await fs.writeFile(jsonOutputPath, `${JSON.stringify(report, null, 2)}\n`);

  process.stdout.write(
    `Legacy parity report written to ${relativeToRepo(markdownOutputPath)} and ${relativeToRepo(jsonOutputPath)}.\n`,
  );

  if (unresolved) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  process.stderr.write(`prove:legacy-parity failed: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
