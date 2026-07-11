---
title: Web Development Basics
date: 2024-03-15
tags: [web, javascript, html, css, beginner]
aliases: [web-dev, 前端开发]
lang: zh-CN
---

# Web Development Basics

> [!info] Overview
> Web development is the process of building and maintaining websites. It encompasses everything from creating simple static pages to complex [[Machine Learning Intro|web applications]].

## The Three Pillars

Web development rests on three core technologies:

1. **HTML** — Structure and content
2. **CSS** — Styling and layout
3. **JavaScript** — Interactivity and logic

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, Quartz!</h1>
    <p>This is a test page.</p>
</body>
</html>
```

## JavaScript Fundamentals

Modern JavaScript (ES6+) introduces powerful features:

```javascript
// Arrow functions
const greet = (name) => `Hello, ${name}!`;

// Destructuring
const { title, author } = book;

// Async/Await
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}
```

> [!tip] Learning Resources
> - [MDN Web Docs](https://developer.mozilla.org) — The definitive reference
> - [[How I Take Notes]] — My approach to organizing learning materials

## CSS Grid vs Flexbox

| Feature | Grid | Flexbox |
|---------|------|---------|
| Dimension | 2D | 1D |
| Best for | Layouts | Components |
| Browser Support | Excellent | Excellent |
| Learning Curve | Moderate | Easy |

```css
/* Grid example */
.container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

/* Flexbox example */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
```

> [!warning] Common Pitfall
> Don't use `!important` excessively — it makes your CSS harder to maintain. See [[My PKM System]] for how I manage project-specific knowledge.

## Frameworks and Tools

The modern web ecosystem includes many tools:

- **React**, **Vue**, **Svelte** — UI frameworks
- **Vite**, **Webpack** — Bundlers
- **TypeScript** — Type-safe JavaScript
- **Tailwind CSS** — Utility-first CSS

> [!note] Related Topics
> - [[Quartz Blog Setup]] — How this website was built
> - [[Git Version Control]] — Version control for web projects
> - [[Docker Containerization]] — Deploying web applications

## Footnotes

Web development has evolved significantly since the early days of the web[^1]. Today, we have sophisticated tools and frameworks that make building complex applications much more accessible[^2].

[^1]: The first website was created by Tim Berners-Lee at CERN in 1991.
[^2]: See [[Machine Learning Intro]] for how AI is changing web development.

---

*Tags: #web #javascript #html #css #beginner*
