function setMobileTocOpen(toc: HTMLElement, open: boolean) {
  const toggle = toc.querySelector<HTMLButtonElement>(".mobile-toc-toggle")
  const panelId = toggle?.getAttribute("aria-controls")
  const panel = panelId ? document.getElementById(panelId) : null
  if (!toggle || !(panel instanceof HTMLElement)) return

  toc.classList.toggle("open", open)
  toggle.setAttribute("aria-expanded", String(open))
  panel.setAttribute("aria-hidden", String(!open))
  document.documentElement.classList.toggle("mobile-toc-open", open)
}

function closeMobileTocs() {
  document.querySelectorAll<HTMLElement>(".mobile-toc.open").forEach((toc) => {
    setMobileTocOpen(toc, false)
  })
  document.documentElement.classList.remove("mobile-toc-open")
}

function closeExplorer() {
  document.querySelectorAll<HTMLElement>(".explorer:not(.collapsed)").forEach((explorer) => {
    explorer.classList.add("collapsed")
    explorer.setAttribute("aria-expanded", "false")
  })
  document.documentElement.classList.remove("mobile-no-scroll")
}

function placeMobileTocs() {
  document.querySelectorAll<HTMLElement>(".sidebar.left").forEach((sidebar) => {
    const toc = sidebar.querySelector<HTMLElement>(".mobile-toc")
    const toolbar = sidebar.querySelector<HTMLElement>(".flex-component:has(.search)")
    if (!toc || !toolbar || toc.parentElement === toolbar) return

    const search = toolbar.querySelector<HTMLElement>(":scope > div:has(.search)")
    toolbar.insertBefore(toc, search ?? toolbar.firstElementChild)
  })
}

document.addEventListener("click", (event) => {
  const target = event.target
  if (!(target instanceof Element)) return

  const toggle = target.closest<HTMLButtonElement>(".mobile-toc-toggle")
  if (toggle) {
    const toc = toggle.closest<HTMLElement>(".mobile-toc")
    if (!toc) return

    const shouldOpen = !toc.classList.contains("open")
    closeMobileTocs()
    if (shouldOpen) {
      closeExplorer()
      setMobileTocOpen(toc, true)
    }
    return
  }

  if (target.closest(".mobile-toc-close, .mobile-toc-list a, .mobile-explorer")) {
    closeMobileTocs()
  }
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileTocs()
})

document.addEventListener("DOMContentLoaded", placeMobileTocs)
document.addEventListener("prenav", closeMobileTocs)
document.addEventListener("nav", () => {
  closeMobileTocs()
  placeMobileTocs()
})
placeMobileTocs()

window.addEventListener("resize", () => {
  if (window.innerWidth > 1200) closeMobileTocs()
})
