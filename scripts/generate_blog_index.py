#!/usr/bin/env python3

import json
import re
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = REPO_ROOT / "blog_posts"
INDEX_PATH = BLOG_DIR / "index.json"
FRONTMATTER_RE = re.compile(r"^---\n([\s\S]*?)\n---\n?([\s\S]*)$")


def parse_frontmatter(markdown_text: str) -> dict[str, str]:
    match = FRONTMATTER_RE.match(markdown_text)
    if not match:
      return {}

    attributes = {}
    for line in match.group(1).splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        attributes[key.strip()] = value.strip().strip('"')
    return attributes


def slugify(filename_stem: str) -> str:
    slug = filename_stem.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def collect_posts() -> list[dict[str, str]]:
    posts = []
    for markdown_path in sorted(BLOG_DIR.glob("*.md")):
        raw = markdown_path.read_text(encoding="utf-8")
        frontmatter = parse_frontmatter(raw)

        title = frontmatter.get("title") or markdown_path.stem
        date = frontmatter.get("date") or "1970-01-01"
        summary = frontmatter.get("summary", "")

        posts.append(
            {
                "slug": slugify(markdown_path.stem),
                "title": title,
                "date": date,
                "summary": summary,
                "file": f"blog_posts/{markdown_path.name}",
            }
        )

    posts.sort(key=lambda post: post["date"], reverse=True)
    return posts


def main() -> None:
    if not BLOG_DIR.exists():
        raise SystemExit(f"Blog directory not found: {BLOG_DIR}")

    posts = collect_posts()
    INDEX_PATH.write_text(
        json.dumps(posts, indent=2, ensure_ascii=True) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(posts)} posts to {INDEX_PATH}")


if __name__ == "__main__":
    main()
