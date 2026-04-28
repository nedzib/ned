# AGENTS.md

- This repo is a static personal site. The shipped app is just root-level `index.html`, `styles.css`, and files in `assets/`.
- There is no verified package manager, build step, test suite, linter, formatter, CI workflow, or repo-local OpenCode config in this repo. Do not guess `npm`/`pnpm` commands or add tooling unless the user asks.
- `index.html` is the only page and all content is hardcoded there. There is no templating, component system, or data source behind the project cards/contact links.
- `index.html` pulls icon/fonts from external CDNs: `devicon@v2.15.1` and Nerd Fonts. If icons change, check those CDN class names first instead of searching for local packages.
- The site styling is all in one `styles.css` file. It mixes TerminalCSS-style base rules with repo-specific variables/utilities and page styles; avoid broad reformatting or framework migrations when a local edit will do.
- Existing markup already uses inline styles in several places (`h1`, avatar image, social icons, Hackster logo). Match the local style of the section you touch instead of doing unrelated cleanup.
- Keep asset references relative to repo root (for example `./assets/ned.png` and `./assets/hackster_logo.svg`). Renaming or moving assets requires updating `index.html` manually.
- For visual changes on `index.html`, opening the file directly is enough. `blog.html` fetches `blog_posts/index.json` and markdown files, so verify blog changes through a local server such as `python3 -m http.server` instead of `file://`.
