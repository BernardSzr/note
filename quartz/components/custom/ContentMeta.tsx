import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import styles from "./contentMeta.scss"

type DateMetadata = {
  dates?: {
    published?: Date
    modified?: Date
  }
}

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function estimateReadingMinutes(text: string): number {
  const isWhitespace = (character: string | undefined) =>
    character !== undefined && " \n\r\t".includes(character)
  const isCjk = (character: string | undefined) => {
    if (!character) return false
    const code = character.charCodeAt(0)
    return (
      (code >= 0x3040 && code <= 0x30ff) ||
      (code >= 0x3400 && code <= 0x4dbf) ||
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0xac00 && code <= 0xd7a3)
    )
  }

  let words = 0
  const normalizedText = `${text}\n`
  for (let index = 0; index < text.length; index += 1) {
    const character = normalizedText[index]
    const nextCharacter = normalizedText[index + 1]
    if (
      isCjk(character) ||
      (!isWhitespace(character) && (isWhitespace(nextCharacter) || isCjk(nextCharacter)))
    ) {
      words += 1
    }
  }

  return Math.max(1, Math.ceil(words / 200))
}

function DateMetadataItem({ label, date, locale }: { label: string; date: Date; locale: string }) {
  return (
    <span class="content-meta-item content-meta-date">
      <span class="content-meta-label">{label}</span>
      <time datetime={date.toISOString()}>{formatDate(date, locale)}</time>
    </span>
  )
}

const ContentMeta: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
  const text = fileData.text as string | undefined
  if (!text) return null

  const dates = (fileData as DateMetadata).dates
  const frontmatter = fileData.frontmatter as
    | { date?: unknown; published?: unknown; publishDate?: unknown }
    | undefined
  const locale = cfg.locale ?? "en-US"
  const minutes = estimateReadingMinutes(text)
  const segments = []

  const hasPublishedDate =
    frontmatter?.date != null || frontmatter?.published != null || frontmatter?.publishDate != null

  if (dates?.published && hasPublishedDate) {
    segments.push(<DateMetadataItem label="Published" date={dates.published} locale={locale} />)
  }

  if (dates?.modified) {
    segments.push(<DateMetadataItem label="Modified" date={dates.modified} locale={locale} />)
  }

  segments.push(<span class="content-meta-item content-meta-reading-time">{minutes} min read</span>)

  return <p class={`${displayClass ?? ""} content-meta`}>{segments}</p>
}

ContentMeta.displayName = "ContentMeta"
ContentMeta.css = styles

export default (() => ContentMeta) satisfies QuartzComponentConstructor
