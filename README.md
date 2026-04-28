# Nedzib Personal Site

Static personal site and blog.

## Structure

- `index.html`: portfolio homepage
- `terminal_css_styles.css`: portfolio styles
- `blog.html`: blog index and post viewer
- `blog.js`: client-side markdown loader and post navigation
- `tufte_css_styles.css`: blog styles
- `blog_posts/`: markdown posts plus `index.json`

## Run locally

Portfolio can be opened directly, but the blog uses `fetch()`, so serve the repo over HTTP:

```bash
python3 -m http.server
```

Then open `http://127.0.0.1:8000/blog.html`.

## Add a blog post

1. Create a new markdown file in `blog_posts/`.
2. Add a matching entry to `blog_posts/index.json`.
3. Use a newer `date` if you want it to appear first; posts are sorted descending by date.

Example index entry:

```json
{
  "slug": "my-new-post",
  "title": "My New Post",
  "date": "2026-04-30",
  "summary": "One-line summary for the listing.",
  "file": "blog_posts/my-new-post.md"
}
```

Example post frontmatter:

```md
---
title: "My New Post"
date: "2026-04-30"
summary: "One-line summary for the listing."
---
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
