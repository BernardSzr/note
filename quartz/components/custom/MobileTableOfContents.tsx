import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import styles from "./mobileToc.scss"
// @ts-ignore: inline scripts are bundled as strings by Quartz.
import script from "./mobileToc.inline"

type TocEntry = {
  depth: number
  text: string
  slug: string
}

let instanceId = 0

const MobileTableOfContents: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
  const entries = fileData.toc as TocEntry[] | undefined
  if (!entries || entries.length === 0) return null

  const title = i18n(cfg.locale).components.tableOfContents.title
  const panelId = `mobile-toc-${instanceId++}`

  return (
    <>
      <div class="mobile-toc">
        <button
          type="button"
          class="mobile-toc-toggle"
          aria-label={title}
          aria-controls={panelId}
          aria-expanded="false"
          title={title}
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
            <path d="M8 6h13" />
            <path d="M8 12h13" />
            <path d="M8 18h13" />
            <path d="M3 6h.01" />
            <path d="M3 12h.01" />
            <path d="M3 18h.01" />
          </svg>
        </button>
      </div>

      <section id={panelId} class="mobile-toc-panel" aria-hidden="true" aria-label={title}>
        <div class="mobile-toc-panel-header">
          <h2>{title}</h2>
          <button type="button" class="mobile-toc-close" aria-label={`Close ${title}`}>
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <nav aria-label={title}>
          <ul class="mobile-toc-list">
            {entries.map(({ depth, text, slug }) => (
              <li class={`depth-${depth}`}>
                <a href={`#${slug}`} data-for={slug}>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </>
  )
}

MobileTableOfContents.displayName = "MobileTableOfContents"
MobileTableOfContents.css = styles
MobileTableOfContents.afterDOMLoaded = script

export default (() => MobileTableOfContents) satisfies QuartzComponentConstructor
