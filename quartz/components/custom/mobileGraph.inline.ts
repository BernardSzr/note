const mobileGraphMedia = window.matchMedia("(max-width: 1200px)")
const mobileGraphOpenStorageKey = "mobile-graph-open"

function restoreMobileGraphState(disclosure: HTMLDetailsElement) {
  if (!mobileGraphMedia.matches) return

  disclosure.open = localStorage.getItem(mobileGraphOpenStorageKey) === "true"
}

function saveMobileGraphState(disclosure: HTMLDetailsElement) {
  if (!mobileGraphMedia.matches) return

  localStorage.setItem(mobileGraphOpenStorageKey, String(disclosure.open))
}

function getLocalGraphContainer(graph: HTMLElement): HTMLElement | null {
  return graph.querySelector<HTMLElement>(".graph-outer > [data-cfg]")
}

function setLocalGraphEnabled(graph: HTMLElement, enabled: boolean) {
  const container = getLocalGraphContainer(graph)
  if (!container) return

  container.classList.toggle("graph-container", enabled)
  container.classList.toggle("mobile-graph-container-paused", !enabled)
}

function placeGraphForViewport(): HTMLElement | null {
  const graph = document.querySelector<HTMLElement>(".graph")
  const slot = document.querySelector<HTMLElement>(".mobile-graph-slot")
  const rightSidebar = document.querySelector<HTMLElement>(".sidebar.right")
  if (!graph || !rightSidebar) return null

  if (mobileGraphMedia.matches && slot && graph.parentElement !== slot) {
    slot.append(graph)
  }

  if (!mobileGraphMedia.matches && graph.parentElement === slot) {
    rightSidebar.prepend(graph)
  }

  return graph
}

function syncGraphForViewport() {
  const graph = placeGraphForViewport()
  if (!graph) return

  const disclosure = graph.closest<HTMLDetailsElement>(".mobile-graph-disclosure")
  setLocalGraphEnabled(graph, !mobileGraphMedia.matches || disclosure?.open === true)
}

function renderGraphAtCurrentSize() {
  const theme = document.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light"
  requestAnimationFrame(() => {
    document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }))
  })
}

function setupMobileGraph() {
  const disclosure = document.querySelector<HTMLDetailsElement>(".mobile-graph-disclosure")
  if (disclosure) restoreMobileGraphState(disclosure)

  syncGraphForViewport()

  if (!disclosure || disclosure.dataset.graphToggleBound === "true") return

  disclosure.dataset.graphToggleBound = "true"
  disclosure.addEventListener("toggle", () => {
    saveMobileGraphState(disclosure)

    const graph = disclosure.querySelector<HTMLElement>(".graph")
    if (!graph) return

    setLocalGraphEnabled(graph, disclosure.open)
    renderGraphAtCurrentSize()
  })
}

function placeGraphAfterBreakpointChange() {
  const disclosure = document.querySelector<HTMLDetailsElement>(".mobile-graph-disclosure")
  if (disclosure) restoreMobileGraphState(disclosure)

  syncGraphForViewport()
  renderGraphAtCurrentSize()
}

document.addEventListener("DOMContentLoaded", setupMobileGraph)
document.addEventListener("nav", setupMobileGraph)
mobileGraphMedia.addEventListener("change", placeGraphAfterBreakpointChange)
