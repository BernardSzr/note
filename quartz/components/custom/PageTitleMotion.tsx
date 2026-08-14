import { QuartzComponent, QuartzComponentConstructor } from "../types"
// @ts-ignore: inline scripts are bundled as strings by Quartz.
import script from "./pageTitleMotion.inline"

const PageTitleMotion: QuartzComponent = () => null

PageTitleMotion.displayName = "PageTitleMotion"
PageTitleMotion.afterDOMLoaded = script

export default (() => PageTitleMotion) satisfies QuartzComponentConstructor
