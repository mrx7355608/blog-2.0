---
title: "First blog"
date: "8-1-2025"
tags: ["Blogging", "Linux", "Web development"]
summary: "This is the first ever blog i am writing inn a markdown file to test how my blogging site is workign"
---

## Introduction
Hi, my name is fawad imran


### 6. **How Frontmatter Works**

When you use `gray-matter`, it parses the frontmatter from your Markdown file and makes it accessible as the `data` property. The `content` is everything below the frontmatter and will be parsed into HTML using the `remark` library.

- **Frontmatter**: Holds metadata like `title`, `summary`, `tags`, `date`.
- **Content**: The actual body of the blog post, which is converted into HTML.

For example:
- **Frontmatter** (`title`, `summary`, etc.) will be parsed by `gray-matter` and stored in `data`.
- **Content** will be processed by `remark` to convert it from Markdown to HTML.

### Conclusion

With this setup:
1. **Frontmatter** allows you to store important metadata about your blog posts (like title, summary, date, tags).
2. **Markdown Content** is separated out from the metadata and processed into HTML for rendering.
3. Your Next.js app can render blog lists and individual posts with the metadata and content properly displayed.

Let me know if you need further clarification or help with the implementation!

