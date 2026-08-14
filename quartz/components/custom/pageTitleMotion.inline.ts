const spaNavigationClass = "is-spa-navigating"
const cursorReadyClass = "is-cursor-ready"
const initialCursorAnimationDuration = 2100
let previousPageTitleUrl = window.location.href

function markPageTitleCursorReady() {
  document.querySelector<HTMLElement>(".page-title")?.classList.add(cursorReadyClass)
}

function replayPageTitleCursor() {
  const currentUrl = window.location.href
  if (currentUrl === previousPageTitleUrl) return

  previousPageTitleUrl = currentUrl
  const pageTitle = document.querySelector<HTMLElement>(".page-title")
  const pageTitleLink = pageTitle?.querySelector<HTMLElement>("a")
  if (!pageTitle || !pageTitleLink) return

  pageTitle.classList.add(cursorReadyClass)
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  pageTitle.classList.remove(spaNavigationClass)
  void pageTitle.offsetWidth
  pageTitle.classList.add(spaNavigationClass)

  const finishNavigationAnimation = (event: AnimationEvent) => {
    if (event.animationName !== "page-title-cursor-nav") return

    pageTitle.classList.remove(spaNavigationClass)
    pageTitleLink.removeEventListener("animationend", finishNavigationAnimation)
  }

  pageTitleLink.addEventListener("animationend", finishNavigationAnimation)
}

window.setTimeout(markPageTitleCursorReady, initialCursorAnimationDuration)
document.addEventListener("nav", replayPageTitleCursor)
