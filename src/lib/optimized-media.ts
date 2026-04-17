import optimizedMediaManifest from "@/lib/optimized-media-manifest.json";
import { normalizeAssetSrc } from "@/lib/utils";

export function getOptimizedAssetSrc(src: string) {
  const normalizedSrc = normalizeAssetSrc(src);

  if (!normalizedSrc) {
    return normalizedSrc;
  }

  return (optimizedMediaManifest as Record<string, string>)[normalizedSrc] ?? normalizedSrc;
}
