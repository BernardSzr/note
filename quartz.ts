import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import MobileOnly from "./quartz/components/MobileOnly"
import ArticleNavigation from "./quartz/components/custom/ArticleNavigation"
import ArchiveIndexLink from "./quartz/components/custom/ArchiveIndexLink"
import MobileGraphSlot from "./quartz/components/custom/MobileGraphSlot"
import MobileTableOfContents from "./quartz/components/custom/MobileTableOfContents"
import PageTitleMotion from "./quartz/components/custom/PageTitleMotion"
import TagsIndexLink from "./quartz/components/custom/TagsIndexLink"
import TagCloud from "./quartz/components/custom/TagCloud"
import ContentMeta from "./quartz/components/custom/ContentMeta"
import type { QuartzComponent, QuartzComponentConstructor } from "./quartz/components/types"
import { componentRegistry } from "./quartz/components/registry"
import { ArchivePageType, PageTypeDispatcher } from "./quartz/plugins/pageTypes"

componentRegistry.setOptionOverrides("explorer", {
  filterFn: (node: { slugSegment?: string }) =>
    node.slugSegment !== "tags" && node.slugSegment !== "archives",
})

const config = await loadQuartzConfig()
const tagPage = config.plugins.pageTypes?.find((pageType) => pageType.name === "TagPage")
if (tagPage) tagPage.body = hideTagsIndexBody(tagPage.body)

const loadedLayout = await loadQuartzLayout()
const tagsIndexLink = TagsIndexLink()
const archiveIndexLink = ArchiveIndexLink()
const articleNavigation = ArticleNavigation()
const contentMeta = ContentMeta()
const tagCloud = TagCloud()

function hideTagsIndexBody(
  originalConstructor: QuartzComponentConstructor,
): QuartzComponentConstructor {
  const Original = originalConstructor(undefined)
  const TagsBody: QuartzComponent = (props) => {
    const slug = props.fileData.slug
    return slug === "tags" || slug === "tags/index" ? null : Original(props)
  }

  TagsBody.displayName = Original.displayName
  TagsBody.css = Original.css
  TagsBody.beforeDOMLoaded = Original.beforeDOMLoaded
  TagsBody.afterDOMLoaded = Original.afterDOMLoaded
  return () => TagsBody
}

function replaceContentMeta(components: QuartzComponent[] | undefined): QuartzComponent[] {
  return (components ?? []).map((component) => {
    const css = String(component.css ?? "")
    return css.includes(".content-meta") ? contentMeta : component
  })
}

loadedLayout.defaults.beforeBody = replaceContentMeta(loadedLayout.defaults.beforeBody)
for (const pageLayout of Object.values(loadedLayout.byPageType)) {
  pageLayout.beforeBody = replaceContentMeta(pageLayout.beforeBody)
}

const defaultLeft = loadedLayout.defaults.left ?? []
loadedLayout.defaults.left = [...defaultLeft, tagsIndexLink, archiveIndexLink]

const tagLayout = loadedLayout.byPageType.tag ?? {}
const tableOfContents = (loadedLayout.defaults.right ?? []).find((component) =>
  String(component.css ?? "").includes("toc-header"),
)
loadedLayout.byPageType.archive = {
  ...tagLayout,
  beforeBody: tagLayout.beforeBody ?? loadedLayout.defaults.beforeBody ?? [],
  left: [...(tagLayout.left ?? defaultLeft), MobileOnly(MobileTableOfContents())],
  right: tableOfContents ? [tableOfContents] : [],
}

for (const [pageType, pageLayout] of Object.entries(loadedLayout.byPageType)) {
  if (pageType !== "404") {
    pageLayout.left = [...(pageLayout.left ?? defaultLeft), tagsIndexLink, archiveIndexLink]
  }
}

loadedLayout.byPageType.tag = {
  ...tagLayout,
  beforeBody: [...(tagLayout.beforeBody ?? loadedLayout.defaults.beforeBody ?? []), tagCloud],
  left: loadedLayout.byPageType.tag?.left ?? defaultLeft,
}

const contentLayout = loadedLayout.byPageType.content ?? {}
const contentAfterBody = contentLayout.afterBody ?? loadedLayout.defaults.afterBody ?? []
const commentsIndex = contentAfterBody.findIndex((component) =>
  String(component.afterDOMLoaded ?? "").includes("iframe.giscus-frame"),
)
const articleNavigationIndex = commentsIndex === -1 ? contentAfterBody.length : commentsIndex
loadedLayout.byPageType.content = {
  ...contentLayout,
  beforeBody: [
    ...(contentLayout.beforeBody ?? loadedLayout.defaults.beforeBody ?? []),
    PageTitleMotion(),
    MobileOnly(MobileGraphSlot()),
  ],
  afterBody: [
    ...contentAfterBody.slice(0, articleNavigationIndex),
    articleNavigation,
    ...contentAfterBody.slice(articleNavigationIndex),
  ],
  left: [
    ...(contentLayout.left ?? loadedLayout.defaults.left ?? []),
    MobileOnly(MobileTableOfContents()),
  ],
}

const dispatcherIndex = config.plugins.emitters.findIndex(
  (emitter) => emitter.name === "PageTypeDispatcher",
)
config.plugins.pageTypes ??= []
config.plugins.pageTypes.push(ArchivePageType())
const dispatcher = PageTypeDispatcher({
  defaults: loadedLayout.defaults,
  byPageType: loadedLayout.byPageType,
})
if (dispatcherIndex === -1) {
  config.plugins.emitters.push(dispatcher)
} else {
  config.plugins.emitters[dispatcherIndex] = dispatcher
}

export default config
export const layout = loadedLayout
