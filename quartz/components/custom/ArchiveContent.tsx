import { isFolderPath, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Date as DateDisplay } from "../Date"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import styles from "./archiveContent.scss"

export type ArchiveFile = QuartzPluginData & {
  unlisted?: boolean
  dates?: {
    published?: Date
  }
}

type ArchiveEntry = {
  file: ArchiveFile
  published?: Date
}

type ArchiveMonth = {
  id: string
  label: string
  entries: ArchiveEntry[]
}

type ArchiveYear = {
  id: string
  label: string
  months: ArchiveMonth[]
}

export type ArchiveTocEntry = {
  depth: number
  text: string
  slug: string
}

function isArchiveArticle(file: ArchiveFile): boolean {
  const slug = file.slug
  return (
    file.unlisted !== true &&
    Boolean(file.filePath) &&
    file.relativePath?.endsWith(".md") === true &&
    Boolean(slug) &&
    !isFolderPath(slug!) &&
    slug !== "archives" &&
    slug !== "archives/index" &&
    !slug!.startsWith("archives/") &&
    !slug!.startsWith("tags/")
  )
}

function publishedDate(file: ArchiveFile): Date | undefined {
  const frontmatter = file.frontmatter as
    | { date?: unknown; published?: unknown; publishDate?: unknown }
    | undefined
  const hasPublishedDate =
    frontmatter?.date != null || frontmatter?.published != null || frontmatter?.publishDate != null
  return hasPublishedDate ? file.dates?.published : undefined
}

function archiveEntries(files: ArchiveFile[], locale: string): ArchiveEntry[] {
  return files
    .filter(isArchiveArticle)
    .map((file) => ({ file, published: publishedDate(file) }))
    .sort((a, b) => {
      const aPublished = a.published?.getTime() ?? Number.NEGATIVE_INFINITY
      const bPublished = b.published?.getTime() ?? Number.NEGATIVE_INFINITY
      if (aPublished !== bPublished) return bPublished - aPublished

      const aTitle = a.file.frontmatter?.title ?? ""
      const bTitle = b.file.frontmatter?.title ?? ""
      return aTitle.localeCompare(bTitle, locale)
    })
}

function groupArchiveEntries(entries: ArchiveEntry[]): ArchiveYear[] {
  const years = new Map<string, ArchiveYear>()

  for (const entry of entries) {
    const yearKey = entry.published ? String(entry.published.getFullYear()) : "undated"
    const monthNumber = entry.published
      ? String(entry.published.getMonth() + 1).padStart(2, "0")
      : "undated"
    const monthKey = yearKey + "-" + monthNumber
    const yearLabel = entry.published ? yearKey : "未注明日期"
    const monthLabel = entry.published ? `${entry.published.getMonth() + 1}月` : "无发表日期"

    let year = years.get(yearKey)
    if (!year) {
      year = {
        id: "archive-" + yearKey,
        label: yearLabel,
        months: [],
      }
      years.set(yearKey, year)
    }

    let month = year.months.find((candidate) => candidate.id === "archive-" + monthKey)
    if (!month) {
      month = {
        id: "archive-" + monthKey,
        label: monthLabel,
        entries: [],
      }
      year.months.push(month)
    }
    month.entries.push(entry)
  }

  return [...years.values()]
}

export function getArchiveToc(files: ArchiveFile[], locale: string): ArchiveTocEntry[] {
  return groupArchiveEntries(archiveEntries(files, locale)).flatMap((year) => [
    { depth: 0, text: year.label, slug: year.id },
    ...year.months.map((month) => ({
      depth: 1,
      text: month.label,
      slug: month.id,
    })),
  ])
}

const ArchiveContent: QuartzComponent = ({ allFiles, cfg, fileData }: QuartzComponentProps) => {
  const entries = archiveEntries(allFiles as ArchiveFile[], cfg.locale)
  const years = groupArchiveEntries(entries)

  return (
    <div class="popover-hint archive-page">
      <div class="archive-overview">
        <p>
          <strong>{entries.length}</strong> articles
        </p>
      </div>

      <div class="archive-groups">
        {years.map((year) => (
          <section class="archive-year" aria-labelledby={year.id}>
            <h2 id={year.id}>
              <span>{year.label}</span>
            </h2>

            <div class="archive-year-content">
              {year.months.map((month) => (
                <section class="archive-month" aria-labelledby={month.id}>
                  <h3 id={month.id}>
                    <span>{month.label}</span>
                  </h3>
                  <ul class="archive-list">
                    {month.entries.map(({ file, published }) => (
                      <li class="archive-item">
                        <p class="archive-date">
                          {published ? (
                            <DateDisplay date={published} locale={cfg.locale} />
                          ) : (
                            <span>未注明日期</span>
                          )}
                        </p>
                        <h4>
                          <a
                            class="internal internal-link"
                            href={resolveRelative(fileData.slug!, file.slug!)}
                          >
                            {file.frontmatter?.title ?? "Untitled"}
                          </a>
                        </h4>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

ArchiveContent.displayName = "ArchiveContent"
ArchiveContent.css = styles

export default (() => ArchiveContent) satisfies QuartzComponentConstructor
