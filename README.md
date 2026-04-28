# Nedzib Personal Site

Static personal site and blog.

## Structure

- `index.html`: portfolio homepage
- `terminal_css_styles.css`: portfolio styles
- `blog.html`: blog index and post viewer
- `blog.js`: client-side markdown loader and post navigation
- `tufte_css_styles.css`: blog styles
- `blog_posts/`: markdown posts plus generated `index.json`
- `scripts/sync_obsidian_blog.sh`: syncs posts from Obsidian into this repo
- `scripts/generate_blog_index.py`: rebuilds `blog_posts/index.json` from frontmatter

## Run locally

Portfolio can be opened directly, but the blog uses `fetch()`, so serve the repo over HTTP:

```bash
python3 -m http.server
```

Then open `http://127.0.0.1:8000/blog.html`.

## Add a blog post

1. Write the post in your Obsidian blog folder.
2. Add frontmatter with `title`, `date`, and optional `summary`.
3. Sync the markdown files into this repo and regenerate the manifest:

```bash
sh scripts/sync_obsidian_blog.sh
```

The sync script copies `.md` files from the Obsidian blog folder into `blog_posts/` and then regenerates `blog_posts/index.json` automatically.

If you ever need to override the source folder temporarily:

```bash
OBSIDIAN_BLOG_DIR="/path/to/other/folder" sh scripts/sync_obsidian_blog.sh
```

Posts are sorted descending by `date`. The generator uses the filename as the base for the `slug`.

Example post frontmatter:

```md
---
title: "My New Post"
date: "2026-04-30"
summary: "One-line summary for the listing."
---
```

Example filename:

```text
2026-04-30 My New Post.md
```

## Extra blog syntax

In addition to normal Markdown, blog posts support these helpers:

- `{{newthought: ...}}`: styles the opening phrase in small caps
- `{{sn: ...}}`: inserts a sidenote
- `{{mn: ...}}`: inserts a margin note

Example:

```md
{{newthought: This is the opening phrase.}} Main paragraph text goes here.

This sentence includes a sidenote. {{sn: This appears in the margin on desktop and collapses on mobile.}}

This sentence includes a margin note. {{mn: This is a margin note without numbering.}}
```

Everything else should use standard Markdown: headings, lists, links, tables, code fences, blockquotes, and images.
