import ArchiveContent, { ArchiveFile, getArchiveToc } from "../../components/custom/ArchiveContent"
import { QuartzPageTypePlugin } from "../types"

export const ArchivePageType: QuartzPageTypePlugin = () => ({
  name: "ArchivePageType",
  priority: 20,
  match: ({ slug }) => slug === "archives" || slug === "archives/index",
  generate: ({ content }) => {
    const hasArchivePage = content.some(([, file]) => {
      const slug = file.data.slug
      return slug === "archives" || slug === "archives/index"
    })
    return hasArchivePage
      ? []
      : [
          {
            slug: "archives/index",
            title: "Archive",
            data: {
              collapseToc: false,
            },
          },
        ]
  },
  treeTransforms: () => [
    (_root, slug, componentData) => {
      if (slug !== "archives" && slug !== "archives/index") return

      componentData.fileData.toc = getArchiveToc(
        componentData.allFiles as ArchiveFile[],
        componentData.cfg.locale,
      )
      componentData.fileData.collapseToc = false
    },
  ],
  layout: "archive",
  body: ArchiveContent,
})
