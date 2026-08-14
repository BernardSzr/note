import { QuartzPluginData } from "../../plugins/vfile"
import { FileTrieNode } from "../../util/fileTrie"
import { FilePath, FullSlug, resolveRelative } from "../../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import styles from "./articleNavigation.scss"

type ExplorerArticle = QuartzPluginData & {
  slug: FullSlug
  title: string
  filePath: FilePath
}

function isArticle(page: QuartzPluginData): boolean {
  const slug = page.slug as string | undefined
  const filePath = page.filePath as string | undefined

  return (
    page.unlisted !== true &&
    filePath?.endsWith(".md") === true &&
    slug !== undefined &&
    slug !== "index" &&
    !slug.endsWith("/index") &&
    slug !== "tags" &&
    !slug.startsWith("tags/")
  )
}

function compareExplorerNodes(
  left: FileTrieNode<ExplorerArticle>,
  right: FileTrieNode<ExplorerArticle>,
): number {
  if (left.isFolder !== right.isFolder) return left.isFolder ? -1 : 1

  return left.displayName.localeCompare(right.displayName, undefined, {
    numeric: true,
    sensitivity: "base",
  })
}

function articlesInExplorerOrder(allFiles: QuartzPluginData[]): ExplorerArticle[] {
  const entries = allFiles.filter(isArticle).map((page) => {
    const article: ExplorerArticle = {
      ...page,
      slug: page.slug as FullSlug,
      title: page.frontmatter?.title ?? (page.slug as string),
      filePath: page.filePath as FilePath,
    }
    return [article.slug, article] as [FullSlug, ExplorerArticle]
  })

  const trie = FileTrieNode.fromEntries(entries)
  trie.sort(compareExplorerNodes)

  return trie
    .entries()
    .map(([, node]) => node.data)
    .filter((article): article is ExplorerArticle => article !== null)
}

const ArticleNavigation: QuartzComponent = ({ fileData, allFiles }: QuartzComponentProps) => {
  const currentSlug = fileData.slug
  if (!currentSlug) return null

  const articles = articlesInExplorerOrder(allFiles)
  const currentIndex = articles.findIndex((article) => article.slug === currentSlug)
  if (currentIndex === -1) return null

  const previous = articles[currentIndex - 1]
  const next = articles[currentIndex + 1]
  if (!previous && !next) return null

  const renderLink = (article: QuartzPluginData, direction: "previous" | "next") => (
    <a
      class={`article-navigation-link ${direction}`}
      href={resolveRelative(currentSlug as FullSlug, article.slug as FullSlug)}
      rel={direction === "previous" ? "prev" : "next"}
    >
      <span class="article-navigation-label">
        <span aria-hidden="true">{direction === "previous" ? "←" : "→"}</span>
        {direction === "previous" ? "上一篇文章" : "下一篇文章"}
      </span>
      <span class="article-navigation-title">{article.frontmatter?.title ?? article.slug}</span>
    </a>
  )

  return (
    <nav class="article-navigation" aria-label="相邻文章">
      {previous && renderLink(previous, "previous")}
      {next && renderLink(next, "next")}
    </nav>
  )
}

ArticleNavigation.displayName = "ArticleNavigation"
ArticleNavigation.css = styles

export default (() => ArticleNavigation) satisfies QuartzComponentConstructor
