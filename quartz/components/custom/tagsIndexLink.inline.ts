type ToolbarState = {
  toolbar: HTMLElement
  menu: HTMLElement
  panel: HTMLElement
  toggle: HTMLButtonElement
  items: HTMLElement[]
  toc?: HTMLElement
  search: HTMLElement
  observer: ResizeObserver
  isOverflow: boolean
}

const toolbarStates = new Map<HTMLElement, ToolbarState>()
const observedSidebars = new Set<HTMLElement>()
const mobileToolbarMedia = window.matchMedia("(max-width: 1200px)")
const titleMinimumScale = 0.16
let menuInstanceId = 0
let placementScheduled = false

function createMenu(
  toolbar: HTMLElement,
): Omit<ToolbarState, "items" | "toc" | "search" | "observer" | "isOverflow"> {
  const menu = document.createElement("div")
  menu.className = "mobile-actions-menu"
  menu.hidden = true

  const panelId = `mobile-actions-panel-${menuInstanceId++}`
  const toggle = document.createElement("button")
  toggle.type = "button"
  toggle.className = "mobile-actions-menu-toggle"
  toggle.setAttribute("aria-label", "More actions")
  toggle.setAttribute("aria-controls", panelId)
  toggle.setAttribute("aria-expanded", "false")
  toggle.title = "More actions"
  toggle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>`

  const panel = document.createElement("div")
  panel.id = panelId
  panel.className = "mobile-actions-menu-panel flex-component"
  panel.setAttribute("aria-hidden", "true")

  menu.append(toggle, panel)
  toolbar.append(menu)

  return { toolbar, menu, panel, toggle }
}

function setMenuOpen(menu: HTMLElement, open: boolean) {
  const toggle = menu.querySelector<HTMLButtonElement>(".mobile-actions-menu-toggle")
  const panel = menu.querySelector<HTMLElement>(".mobile-actions-menu-panel")
  if (!toggle || !panel) return

  menu.classList.toggle("open", open)
  toggle.setAttribute("aria-expanded", String(open))
  panel.setAttribute("aria-hidden", String(!open))
}

function closeMenus() {
  document.querySelectorAll<HTMLElement>(".mobile-actions-menu.open").forEach((menu) => {
    setMenuOpen(menu, false)
  })
}

function collapseMobileExplorers() {
  document.querySelectorAll<HTMLElement>(".sidebar.left .explorer").forEach((explorer) => {
    explorer.classList.add("collapsed")
    explorer.setAttribute("aria-expanded", "false")
  })
  document.documentElement.classList.remove("mobile-no-scroll")
}

function getExpandedItems(state: ToolbarState) {
  return [state.toc, ...state.items].filter(
    (item): item is HTMLElement => item instanceof HTMLElement,
  )
}

function getRequiredWidth(state: ToolbarState) {
  const visibleItems = getExpandedItems(state).filter(
    (item) => getComputedStyle(item).display !== "none",
  )
  const searchSize =
    Number.parseFloat(
      getComputedStyle(state.toolbar).getPropertyValue("--search-collapsed-size"),
    ) || 34
  const itemWidth = visibleItems.reduce((width, item) => {
    if (item === state.search) return width + searchSize
    return width + 34
  }, 0)
  const gap = Number.parseFloat(getComputedStyle(state.toolbar).columnGap) || 0

  return itemWidth + gap * Math.max(visibleItems.length - 1, 0)
}

function getAvailableWidth(state: ToolbarState) {
  if (!state.isOverflow) return state.toolbar.clientWidth

  // Overflow mode pins the toolbar to its persistent action column. Measure it with
  // the normal grid rules so a wider sidebar can move the actions back out.
  state.menu.classList.remove("is-overflow")
  const availableWidth = state.toolbar.clientWidth
  state.menu.classList.add("is-overflow")
  return availableWidth
}

function placePersistentItems(state: ToolbarState) {
  if (state.toc) state.toolbar.insertBefore(state.toc, state.menu)
}

function placeExpandedItems(state: ToolbarState) {
  const expandedItems = getExpandedItems(state)
  const toolbarItems = [...state.toolbar.children].filter((item) =>
    expandedItems.includes(item as HTMLElement),
  )
  if (!expandedItems.every((item, index) => toolbarItems[index] === item)) {
    expandedItems.forEach((item) => state.toolbar.insertBefore(item, state.menu))
  }
}

function setOverflowMode(state: ToolbarState, overflow: boolean) {
  if (state.isOverflow === overflow) return

  state.isOverflow = overflow
  state.menu.classList.toggle("is-overflow", overflow)
  state.menu.hidden = !overflow

  if (overflow) {
    closeMenus()
    placePersistentItems(state)
    const panelItems = [...state.panel.children]
    if (!state.items.every((item, index) => panelItems[index] === item)) {
      state.panel.append(...state.items)
    }
    return
  }

  setMenuOpen(state.menu, false)
  placeExpandedItems(state)
}

function updateMobileTitle(state: ToolbarState) {
  const sidebar = state.toolbar.closest<HTMLElement>(".sidebar.left")
  const title = sidebar?.querySelector<HTMLElement>(":scope > .page-title")
  const link = title?.querySelector<HTMLElement>("a")
  if (!sidebar || !title || !link) return

  if (!mobileToolbarMedia.matches || !state.isOverflow) {
    sidebar.classList.remove("mobile-title-hidden")
    title.style.removeProperty("--mobile-title-scale")
    return
  }

  const sidebarStyle = getComputedStyle(sidebar)
  const horizontalPadding =
    (Number.parseFloat(sidebarStyle.paddingLeft) || 0) +
    (Number.parseFloat(sidebarStyle.paddingRight) || 0)
  const gap = Number.parseFloat(sidebarStyle.columnGap) || 0
  const fixedControlsWidth = 34 + state.toolbar.clientWidth + gap * 2
  const availableWidth = Math.max(0, sidebar.clientWidth - horizontalPadding - fixedControlsWidth)
  const naturalWidth = link.offsetWidth
  const scale = naturalWidth > 0 ? Math.min(1, availableWidth / naturalWidth) : 0
  const hidden = scale < titleMinimumScale

  title.style.setProperty("--mobile-title-scale", String(scale))
  sidebar.classList.toggle("mobile-title-hidden", hidden)
}

function updateToolbar(state: ToolbarState) {
  if (!state.toolbar.isConnected) return

  if (!mobileToolbarMedia.matches) {
    setOverflowMode(state, false)
    updateMobileTitle(state)
    return
  }

  const requiredWidth = getRequiredWidth(state)
  const availableWidth = getAvailableWidth(state)
  const shouldOverflow = availableWidth < requiredWidth
  setOverflowMode(state, shouldOverflow)
  updateMobileTitle(state)
}

function getToolbarState(toolbar: HTMLElement, sidebar: HTMLElement) {
  let state = toolbarStates.get(toolbar)
  if (
    state &&
    (!state.menu.isConnected ||
      state.menu.parentElement !== toolbar ||
      state.panel.parentElement !== state.menu)
  ) {
    state.observer.disconnect()
    toolbarStates.delete(toolbar)
    state = undefined
  }

  const findExisting = (selector: string) =>
    (state ? getExpandedItems(state) : []).find(
      (item) => item.isConnected && (item.matches(selector) || item.querySelector(selector)),
    )
  const search =
    findExisting(".search") ?? toolbar.querySelector<HTMLElement>(":scope > div:has(> .search)")
  const tags =
    findExisting(".tags-index-nav") ?? sidebar.querySelector<HTMLElement>(".tags-index-nav")
  const archive =
    findExisting(".archive-index-nav") ?? sidebar.querySelector<HTMLElement>(".archive-index-nav")
  const theme =
    findExisting(".darkmode") ?? toolbar.querySelector<HTMLElement>(":scope > div:has(> .darkmode)")
  const toc = findExisting(".mobile-toc") ?? sidebar.querySelector<HTMLElement>(".mobile-toc")

  if (!search || !tags || !archive || !theme) return null

  if (!state) {
    const menu = createMenu(toolbar)
    state = {
      ...menu,
      items: [],
      search,
      observer: new ResizeObserver(() => updateToolbar(state as ToolbarState)),
      isOverflow: false,
    }
    toolbarStates.set(toolbar, state)
    state.observer.observe(toolbar)
  }

  state.observer.observe(sidebar)

  state.search = search
  state.toc = toc
  state.items = [search, tags, archive, theme]
  return state
}

function placeToolbarActions() {
  for (const [toolbar, state] of toolbarStates) {
    if (!toolbar.isConnected) {
      state.observer.disconnect()
      toolbarStates.delete(toolbar)
    }
  }

  document.querySelectorAll<HTMLElement>(".sidebar.left").forEach((sidebar) => {
    const toolbar = sidebar.querySelector<HTMLElement>(".flex-component:has(.search)")
    if (!toolbar) return

    const state = getToolbarState(toolbar, sidebar)
    if (!state) return

    if (state.isOverflow) {
      placePersistentItems(state)
      const panelItems = [...state.panel.children]
      if (!state.items.every((item, index) => panelItems[index] === item)) {
        state.panel.append(...state.items)
      }
    } else {
      placeExpandedItems(state)
    }
    updateToolbar(state)

    if (!observedSidebars.has(sidebar)) {
      const observer = new MutationObserver(schedulePlacement)
      observer.observe(sidebar, { childList: true })
      observedSidebars.add(sidebar)
    }
  })
}

function schedulePlacement() {
  if (placementScheduled) return
  placementScheduled = true
  requestAnimationFrame(() => {
    placementScheduled = false
    placeToolbarActions()
  })
}

document.addEventListener("click", (event) => {
  const target = event.target
  if (!(target instanceof Element)) return

  const toggle = target.closest<HTMLButtonElement>(".mobile-actions-menu-toggle")
  if (toggle) {
    const menu = toggle.closest<HTMLElement>(".mobile-actions-menu")
    if (!menu) return

    const shouldOpen = !menu.classList.contains("open")
    closeMenus()
    setMenuOpen(menu, shouldOpen)
    return
  }

  if (target.closest(".mobile-toc-toggle, .mobile-explorer")) {
    closeMenus()
    return
  }

  if (
    target.closest(
      ".mobile-actions-menu-panel .search-button, .mobile-actions-menu-panel .tags-index-nav a, .mobile-actions-menu-panel .archive-index-nav a, .mobile-actions-menu-panel .darkmode",
    )
  ) {
    closeMenus()
    return
  }

  if (!target.closest(".mobile-actions-menu")) closeMenus()
})

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenus()
})

document.addEventListener("DOMContentLoaded", placeToolbarActions)
document.addEventListener("prenav", closeMenus)
document.addEventListener("nav", () => {
  closeMenus()
  if (mobileToolbarMedia.matches) collapseMobileExplorers()
  schedulePlacement()
  setTimeout(schedulePlacement, 0)
})
mobileToolbarMedia.addEventListener("change", (event) => {
  if (event.matches) {
    closeMenus()
    collapseMobileExplorers()
  } else {
    document.documentElement.classList.remove("mobile-no-scroll")
  }
  schedulePlacement()
})
placeToolbarActions()
if (mobileToolbarMedia.matches) collapseMobileExplorers()
document.fonts.ready.then(schedulePlacement)
