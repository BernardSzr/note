import { FullSlug, getAllSegmentPrefixes, resolveRelative } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import styles from "./tagCloud.scss"

type TagFile = QuartzPluginData & { unlisted?: boolean }

const TagCloud: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const slug = fileData.slug as FullSlug
  if (slug !== "tags" && slug !== "tags/index") return null

  const tagCounts = new Map<string, number>()
  for (const file of allFiles as TagFile[]) {
    if (file.unlisted === true || !file.filePath || file.slug?.startsWith("tags/")) continue

    const tags = new Set((file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes))
    for (const tag of tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
  }

  const tags = [...tagCounts].sort(([a], [b]) => a.localeCompare(b))
  if (tags.length === 0) return null

  return (
    <nav class="tag-cloud" aria-label="All tags">
      <p class="tag-cloud-title">All tags</p>
      <div class="tag-cloud-list">
        {tags.map(([tag, count]) => (
          <a
            class="internal tag-link"
            href={resolveRelative(slug, ("tags/" + tag) as FullSlug)}
            title={count + " " + (count === 1 ? "article" : "articles")}
          >
            {tag}
          </a>
        ))}
      </div>
    </nav>
  )
}

TagCloud.displayName = "TagCloud"
TagCloud.css = styles

export default (() => TagCloud) satisfies QuartzComponentConstructor
