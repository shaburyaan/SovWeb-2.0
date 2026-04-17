from __future__ import annotations

from collections import deque
import json
from pathlib import Path
import sys

from PIL import Image


REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_ROOT = REPO_ROOT / "public" / "optimized-media"
MANIFEST_PATH = REPO_ROOT / "src" / "lib" / "optimized-media-manifest.json"
SOURCE_ROOTS = [
    REPO_ROOT / "homepage",
    REPO_ROOT / "hy" / "garofalo",
    REPO_ROOT / "caputo",
    REPO_ROOT / "delverde",
    REPO_ROOT / "garofalo",
    REPO_ROOT / "logo",
    REPO_ROOT / "logo-g",
    REPO_ROOT / "sacla",
    REPO_ROOT / "sterilgarda",
    REPO_ROOT / "virgilio",
    REPO_ROOT / "wp-content" / "uploads" / "2022" / "09",
    REPO_ROOT / "wp-content" / "uploads" / "2022" / "10",
    REPO_ROOT / "wp-content" / "uploads" / "2022" / "11",
    REPO_ROOT / "wp-content" / "uploads" / "2022" / "12",
    REPO_ROOT / "wp-content" / "uploads" / "2023",
    REPO_ROOT / "wp-content" / "uploads" / "2025",
]
RASTER_SUFFIXES = {".jpg", ".jpeg", ".png"}
WHITE_THRESHOLD = 238
DIFF_THRESHOLD = 26
MAX_INTERNAL_ISLAND_RATIO = 0.07


def is_background_pixel(pixel: tuple[int, int, int, int]) -> bool:
    r, g, b, a = pixel
    if a <= 8:
        return True
    if min(r, g, b) < WHITE_THRESHOLD:
        return False
    return max(abs(r - g), abs(r - b), abs(g - b)) <= DIFF_THRESHOLD


def remove_edge_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))

    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))

        pixel = pixels[x, y]
        if not is_background_pixel(pixel):
            continue

        pixels[x, y] = (pixel[0], pixel[1], pixel[2], 0)

        if x > 0:
            queue.append((x - 1, y))
        if x < width - 1:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y < height - 1:
            queue.append((x, y + 1))

    return rgba


def crop_to_content(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()

    if not bbox:
        return image

    width, height = image.size
    pad = max(12, round(max(width, height) * 0.025))
    left = max(0, bbox[0] - pad)
    top = max(0, bbox[1] - pad)
    right = min(width, bbox[2] + pad)
    bottom = min(height, bbox[3] + pad)
    return image.crop((left, top, right, bottom))


def is_logo_like(source_path: Path) -> bool:
    path_value = source_path.as_posix().lower()
    parts = {part.lower() for part in source_path.parts}
    if "logo" in parts or "logo-g" in parts:
        return True
    if "russian-standart" in path_value or "russkiy-standart" in path_value:
        return True
    return source_path.suffix.lower() == ".png" and ("garofalo" in parts or "hy" in parts)


def remove_internal_white_islands(image: Image.Image, source_path: Path) -> Image.Image:
    if not is_logo_like(source_path):
        return image

    rgba = image.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    visited: set[tuple[int, int]] = set()
    max_component_area = max(24, int(width * height * MAX_INTERNAL_ISLAND_RATIO))

    for y in range(height):
        for x in range(width):
            if (x, y) in visited:
                continue

            pixel = pixels[x, y]
            if not is_background_pixel(pixel):
                continue

            queue: deque[tuple[int, int]] = deque([(x, y)])
            component: list[tuple[int, int]] = []
            touches_edge = False

            while queue:
                cx, cy = queue.popleft()
                if (cx, cy) in visited:
                    continue
                visited.add((cx, cy))

                current = pixels[cx, cy]
                if not is_background_pixel(current):
                    continue

                component.append((cx, cy))
                if cx == 0 or cy == 0 or cx == width - 1 or cy == height - 1:
                    touches_edge = True

                if cx > 0:
                    queue.append((cx - 1, cy))
                if cx < width - 1:
                    queue.append((cx + 1, cy))
                if cy > 0:
                    queue.append((cx, cy - 1))
                if cy < height - 1:
                    queue.append((cx, cy + 1))

            if touches_edge or not component or len(component) > max_component_area:
                continue

            for cx, cy in component:
                current = pixels[cx, cy]
                pixels[cx, cy] = (current[0], current[1], current[2], 0)

    return rgba


def process_image(source_path: Path) -> None:
    relative_path = source_path.relative_to(REPO_ROOT)
    output_path = OUTPUT_ROOT / relative_path.with_suffix(".webp")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source_path) as image:
        prepared = crop_to_content(remove_internal_white_islands(remove_edge_background(image), source_path))
        prepared.save(output_path, format="WEBP", quality=92, method=6)


def load_existing_manifest() -> dict[str, str]:
    if not MANIFEST_PATH.exists():
        return {}

    try:
        return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}


def resolve_source_roots(arguments: list[str]) -> list[Path]:
    if not arguments:
        return SOURCE_ROOTS

    return [REPO_ROOT / Path(argument) for argument in arguments]


def iter_source_files(roots: list[Path]) -> list[Path]:
    files: list[Path] = []
    for root in roots:
        if not root.exists():
            continue

        if root.is_file():
            if root.suffix.lower() in RASTER_SUFFIXES and not root.name.endswith(".backup"):
                files.append(root)
            continue

        for path in root.rglob("*"):
            if path.suffix.lower() not in RASTER_SUFFIXES:
                continue
            if path.name.endswith(".backup"):
                continue
            files.append(path)

    return files


def main() -> None:
    source_roots = resolve_source_roots(sys.argv[1:])
    files = iter_source_files(source_roots)
    manifest = load_existing_manifest()
    for path in files:
        process_image(path)
        source_key = "/" + path.relative_to(REPO_ROOT).as_posix()
        target_value = "/optimized-media/" + path.relative_to(REPO_ROOT).with_suffix(".webp").as_posix()
        manifest[source_key] = target_value

    MANIFEST_PATH.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n", encoding="utf-8")
    print(f"Prepared {len(files)} optimized media files in {OUTPUT_ROOT}")


if __name__ == "__main__":
    main()
