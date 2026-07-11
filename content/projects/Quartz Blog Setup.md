---
title: Quartz Blog Setup
date: 2024-08-01
tags: [quartz, blog, web, static-site, obsidian]
aliases: [Quartz搭建, 博客配置]
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
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
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
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({
        wikilinks: true,
        callouts: true,
        mermaid: true,
        mark: true,
      }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({
        markdownLinkResolution: "shortest",
      }),
      Plugin.Description(),
      Plugin.LaTeX({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
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

permissions:
  contents: write

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

> [!warning] Important
> Make sure your content repository is set up correctly. I use [[Git Version Control|Git submodules]] to manage content separately.

## Custom Features

### Backlinks

> [!tip] Bidirectional Links
> Quartz automatically generates backlinks from `[[wikilinks]]`. This creates a connected knowledge graph.

For example, this note links to:
- [[Web Development Basics]] — Technologies used
- [[Docker Containerization]] — Deployment
- [[How I Take Notes]] — Note-taking workflow
- [[My PKM System]] — Knowledge management

### Search

Quartz includes full-text search out of the box. The search index is built at compile time.

### Graph View

> [!note] Network Visualization
> The graph view shows connections between notes. It's powered by D3.js and renders a force-directed graph.

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
