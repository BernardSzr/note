import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
// @ts-ignore: inline scripts are bundled as strings by Quartz.
import script from "./mobileGraph.inline"

const MobileGraphSlot: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const title = i18n(cfg.locale).components.graph.title

  return (
    <details class="mobile-graph-disclosure">
      <summary>{title}</summary>
      <div class="mobile-graph-slot" />
    </details>
  )
}

MobileGraphSlot.displayName = "MobileGraphSlot"
MobileGraphSlot.beforeDOMLoaded = script

export default (() => MobileGraphSlot) satisfies QuartzComponentConstructor
