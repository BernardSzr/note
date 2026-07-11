---
title: Quartz Blog Setup
date: 2024-08-01
tags: [quartz, blog, web, static-site, obsidian]
aliases: [Quartz搭建, 博客配置]
lang: zh-CN
---

# Quartz Blog Setup

> [!abstract] Project Overview
> This note documents how I set up my personal blog using Quartz v5, a static site generator designed for [[Web Development Basics|web content]] published from Obsidian notes.

## What is Quartz?

> [!info] Quartz
> Quartz is a static site generator that transforms Markdown notes into a website. It's designed to work seamlessly with Obsidian, supporting features like:

- [[Git Version Control|Version control]] with Git
- Bidirectional links
- Full-text search
- Graph view
- Backlinks

## Installation

> [!tip] Prerequisites
> - Node.js 18+
> - Git
> - npm or pnpm

```bash
# Clone the repository
git clone https://github.com/jackyzha0/quartz.git
cd quartz

# Install dependencies
npm install

# Start development server
npm run server
```

> [!note] My Setup
> I keep my Quartz configuration in a separate repository from my content. This allows me to:
> 1. Version control content independently
> 2. Use [[Docker Containerization|Docker]] for consistent builds
> 3. Deploy to multiple platforms

## Configuration

### quartz.config.ts

```typescript
import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

const config: QuartzConfig = {
  configuration: {
    pageTitle: "Song's Digital Garden",
    enableSPA: true,
    enablePopovers: true,
    locale: "en-US",
    baseUrl: "song-zirui.github.io",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "JetBrains Mono",
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.ObsidianFlavoredMarkdown({
        wikilinks: true,
        callouts: true,
        mermaid: true,
        mark: true,
      }),
      Plugin.LaTeX({ renderEngine: "katex" }),
    ],
    emitters: [
      Plugin.ContentPage(),
      Plugin.ContentIndex({ enableSiteMap: true, enableRSS: true }),
    ],
  },
}

export default config
```

## Deployment

> [!note] Deployment Options
> I chose GitHub Pages for its simplicity and free hosting.

### GitHub Actions Workflow

```yaml
name: Deploy Quartz

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Build Quartz
        run: npx quartz build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## Custom Features

### Backlinks

> [!tip] Bidirectional Links
> Quartz automatically generates backlinks from `[[wikilinks]]`. This creates a connected knowledge graph.

For example, this note links to:
- [[Web Development Basics]] — Technologies used
- [[Docker Containerization]] — Deployment
- [[How I Take Notes]] — Note-taking workflow
- [[My PKM System]] — Knowledge management

## Troubleshooting

> [!danger] Common Issues
> 1. **Build fails** — Check Node.js version (18+ required)
> 2. **Links broken** — Verify filenames match exactly
> 3. **Styles missing** — Run `npm run build` to regenerate
> 4. **Images not showing** — Use relative paths from the note's location

> [!note] See Also
> - [[Web Development Basics]] — Web technologies
> - [[Git Version Control]] — Version control
> - [[How I Take Notes]] — Content creation workflow

---

*Tags: #quartz #blog #web #static-site #obsidian*
