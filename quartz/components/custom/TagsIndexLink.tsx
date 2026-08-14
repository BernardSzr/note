import { FullSlug, resolveRelative } from "../../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import styles from "./tagsIndexLink.scss"
// @ts-ignore: inline scripts are bundled as strings by Quartz.
import script from "./tagsIndexLink.inline"

const TagsIndexLink: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug as FullSlug
  const isTagsIndex = slug === "tags" || slug === "tags/index"

  return (
    <div class="tags-index-nav">
      <a
        href={resolveRelative(slug, "tags" as FullSlug)}
        aria-label="Browse all tags"
        title="Browse all tags"
        aria-current={isTagsIndex ? "page" : undefined}
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
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
          <path d="M7.5 7.5h.01" />
        </svg>
      </a>
    </div>
  )
}

TagsIndexLink.displayName = "TagsIndexLink"
TagsIndexLink.css = styles
TagsIndexLink.afterDOMLoaded = script

export default (() => TagsIndexLink) satisfies QuartzComponentConstructor
