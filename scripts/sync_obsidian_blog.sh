#!/bin/sh

set -eu

REPO_ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
SOURCE_DIR=${OBSIDIAN_BLOG_DIR:-"/Users/nedzibsastoque/Library/Mobile Documents/iCloud~md~obsidian/Documents/ned_notas/blog/ned_blog"}
TARGET_DIR="$REPO_ROOT/blog_posts"

if [ ! -d "$SOURCE_DIR" ]; then
  printf 'Source directory not found: %s\n' "$SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR"

rsync -av --delete --include='*/' --include='*.md' --exclude='*' "$SOURCE_DIR/" "$TARGET_DIR/"
python3 "$REPO_ROOT/scripts/generate_blog_index.py"
