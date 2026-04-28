(function () {
  const manifestPath = "./blog_posts/index.json";
  const contentEl = document.getElementById("blog-content");
  const listEl = document.getElementById("post-list");
  const archiveEl = document.querySelector(".blog-index");
  const shellEl = document.querySelector(".blog-shell");
  const actionsEl = document.querySelector(".blog-actions");
  const search = new URLSearchParams(window.location.search);
  const currentSlug = search.get("post");

  if (!contentEl || !listEl || typeof marked === "undefined") {
    return;
  }

  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  fetch(manifestPath)
    .then((response) => {
      if (!response.ok) throw new Error("Could not load post index");
      return response.json();
    })
    .then((posts) => {
      const orderedPosts = [...posts].sort(comparePostsByDateDesc);

      renderPostList(orderedPosts, currentSlug);

      if (!currentSlug) {
        toggleArchive(false);
        togglePostActions(false);
        renderIndexLanding(orderedPosts);
        return;
      }

      const post = orderedPosts.find((entry) => entry.slug === currentSlug);

      if (!post) {
        toggleArchive(true);
        togglePostActions(false);
        renderMissingPost(orderedPosts, currentSlug);
        return;
      }

      toggleArchive(false);
      togglePostActions(true);
      renderPost(post, orderedPosts);
    })
    .catch((error) => {
      contentEl.innerHTML = [
        '<p class="danger">Failed to load the blog index.</p>',
        `<p>${escapeHtml(error.message)}</p>`,
      ].join("");
    });

  function toggleArchive(visible) {
    if (!archiveEl) return;
    archiveEl.hidden = !visible;
    if (shellEl) {
      shellEl.classList.toggle("is-post-view", !visible);
    }
  }

  function togglePostActions(visible) {
    if (!actionsEl) return;
    actionsEl.hidden = !visible;
  }

  function renderPostList(posts, activeSlug) {
    if (!posts.length) {
      listEl.innerHTML = "<p>No posts yet.</p>";
      return;
    }

    listEl.innerHTML = `
      <ol class="post-list">
        ${posts
          .map((post) => {
            const activeClass = post.slug === activeSlug ? "is-active" : "";
            return `
              <li class="post-list-item ${activeClass}">
                <a href="./blog.html?post=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a>
                <p class="post-meta">${escapeHtml(formatDate(post.date))}</p>
                <p>${escapeHtml(post.summary || "")}</p>
              </li>
            `;
          })
          .join("")}
      </ol>
    `;
  }

  function renderIndexLanding(posts) {
    const latest = posts[0];
    contentEl.innerHTML = `
      <section class="blog-listing">
        ${latest ? posts
          .map(
            (post) => `
              <article class="listing-frame">
                <p class="post-meta">${escapeHtml(formatDate(post.date))}</p>
                <h2><a href="./blog.html?post=${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h2>
                ${post.summary ? `<p>${escapeHtml(post.summary)}</p>` : ""}
              </article>
            `,
          )
          .join("") : "<p>No published posts yet.</p>"}
      </section>
    `;
  }

  function renderMissingPost(posts, slug) {
    contentEl.innerHTML = `
      <section>
        <h2>Post not found</h2>
        <p>The slug <code>${escapeHtml(slug)}</code> is not registered in <code>blog_posts/index.json</code>.</p>
        <p><a href="./blog.html">Back to all posts</a></p>
      </section>
    `;
    renderPostList(posts, null);
  }

  function renderPost(post, posts) {
    loadMarkdown(post)
      .then((markdown) => {
        if (looksLikeJsonNotFound(markdown)) {
          throw new Error("The server returned JSON instead of the markdown file");
        }
        return markdown;
      })
      .then((markdown) => {
        const parsed = parseFrontmatter(markdown);
        const enhancedMarkdown = injectTufteShortcodes(parsed.body);
        const html = marked.parse(enhancedMarkdown);
        const adjacent = findAdjacentPosts(posts, post.slug);
        const title = parsed.attributes.title || post.title;
        const summary = parsed.attributes.summary || post.summary || "";
        const publishedAt = parsed.attributes.date || post.date;

        document.title = `${title} | Nedzib Notes`;
        contentEl.innerHTML = `
          <article class="post-article">
            <p class="post-meta post-meta-banner">${escapeHtml(formatDate(publishedAt))}</p>
            <div class="post-frame">
              <header class="post-header">
                <h2>${escapeHtml(title)}</h2>
                ${summary ? `<p class="subtitle">${escapeHtml(summary)}</p>` : ""}
              </header>
              <section class="post-content">${html}</section>
              <nav class="blog-nav" aria-label="Post navigation">
                <span>${adjacent.previous ? `<a href="./blog.html?post=${encodeURIComponent(adjacent.previous.slug)}">Previous: ${escapeHtml(adjacent.previous.title)}</a>` : ""}</span>
                <span>${adjacent.next ? `<a href="./blog.html?post=${encodeURIComponent(adjacent.next.slug)}">Next: ${escapeHtml(adjacent.next.title)}</a>` : ""}</span>
              </nav>
            </div>
          </article>
        `;
      })
      .catch((error) => {
        contentEl.innerHTML = `
          <p class="danger">Failed to load the selected post.</p>
          <p>${escapeHtml(error.message)}</p>
          <p class="blog-note">Check that the post file exists under <code>blog_posts/</code> and that you are serving the repo over HTTP.</p>
        `;
      });
  }

  function loadMarkdown(post) {
    const candidates = buildMarkdownCandidates(post);

    return candidates.reduce((promise, candidate) => {
      return promise.catch(() => fetchMarkdownCandidate(candidate));
    }, Promise.reject(new Error("No markdown candidates available")));
  }

  function buildMarkdownCandidates(post) {
    const candidates = [
      post.file,
      `./blog_posts/${post.slug}.md`,
      `blog_posts/${post.slug}.md`,
      `/blog_posts/${post.slug}.md`,
    ].filter(Boolean);

    return [...new Set(candidates)];
  }

  function fetchMarkdownCandidate(candidate) {
    return fetch(candidate)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load markdown from ${candidate}`);
        }

        return response.text().then((body) => {
          if (looksLikeJsonNotFound(body)) {
            throw new Error(`Path resolved to non-markdown content: ${candidate}`);
          }

          return body;
        });
      });
  }

  function looksLikeJsonNotFound(body) {
    const trimmed = String(body).trim();

    if (!(trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      return false;
    }

    try {
      const parsed = JSON.parse(trimmed);
      return typeof parsed.detail === "string" && /not found/i.test(parsed.detail);
    } catch {
      return false;
    }
  }

  function parseFrontmatter(markdown) {
    const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

    if (!match) {
      return { attributes: {}, body: markdown };
    }

    const attributes = {};
    const rawAttributes = match[1].split("\n");

    rawAttributes.forEach((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) return;

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      attributes[key] = value.replace(/^"|"$/g, "");
    });

    return { attributes, body: match[2] };
  }

  function injectTufteShortcodes(markdown) {
    let noteCounter = 0;

    return markdown
      .replace(/\{\{newthought:\s*([\s\S]*?)\}\}/g, (_, content) => {
        return `<span class="newthought">${content.trim()}</span>`;
      })
      .replace(/\{\{sn:\s*([\s\S]*?)\}\}/g, (_, content) => {
        noteCounter += 1;
        const id = `sn-${noteCounter}`;
        return [
          `<label for="${id}" class="margin-toggle sidenote-number"></label>`,
          `<input type="checkbox" id="${id}" class="margin-toggle" />`,
          `<span class="sidenote">${content.trim()}</span>`,
        ].join("");
      })
      .replace(/\{\{mn:\s*([\s\S]*?)\}\}/g, (_, content) => {
        noteCounter += 1;
        const id = `mn-${noteCounter}`;
        return [
          `<label for="${id}" class="margin-toggle">&#8853;</label>`,
          `<input type="checkbox" id="${id}" class="margin-toggle" />`,
          `<span class="marginnote">${content.trim()}</span>`,
        ].join("");
      });
  }

  function findAdjacentPosts(posts, slug) {
    const index = posts.findIndex((post) => post.slug === slug);
    return {
      previous: index < posts.length - 1 ? posts[index + 1] : null,
      next: index > 0 ? posts[index - 1] : null,
    };
  }

  function formatDate(value) {
    if (!value) return "Draft";

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }

  function comparePostsByDateDesc(a, b) {
    const left = new Date(`${a.date || "1970-01-01"}T00:00:00`).getTime();
    const right = new Date(`${b.date || "1970-01-01"}T00:00:00`).getTime();
    return right - left;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
