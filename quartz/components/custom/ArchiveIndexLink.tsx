import { FullSlug, resolveRelative } from "../../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import styles from "./archiveIndexLink.scss"

const ArchiveIndexLink: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug as FullSlug
  const isArchive = slug === "archives" || slug === "archives/index"

  return (
    <div class="archive-index-nav">
      <a
        href={resolveRelative(slug, "archives" as FullSlug)}
        aria-label="Archive"
        title="Archive"
        aria-current={isArchive ? "page" : undefined}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect width="20" height="5" x="2" y="3" rx="1" />
          <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </svg>
      </a>
    </div>
  )
}

ArchiveIndexLink.displayName = "ArchiveIndexLink"
ArchiveIndexLink.css = styles

export default (() => ArchiveIndexLink) satisfies QuartzComponentConstructor
